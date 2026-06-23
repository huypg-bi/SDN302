import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions, createQuestion, updateQuestion, deleteQuestion } from '../store/questionSlice';

const emptyForm = { text: '', options: ['', '', '', ''], correctAnswerIndex: 0 };

function MyQuestionsPage() {
    const dispatch = useDispatch();
    const { questions, isLoading, error } = useSelector((state) => state.questions);
    const user = useSelector((state) => state.auth.user);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        dispatch(fetchQuestions());
    }, [dispatch]);

    const myQuestions = questions.filter((q) => q.author === user?._id);

    const handleOptionChange = (index, value) => {
        const updated = [...form.options];
        updated[index] = value;
        setForm({ ...form, options: updated });
    };

    const handleEdit = (question) => {
        const opts = [...question.options];
        while (opts.length < 4) opts.push('');
        setForm({ text: question.text, options: opts, correctAnswerIndex: question.correctAnswerIndex });
        setEditingId(question._id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this question?')) {
            dispatch(deleteQuestion(id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            text: form.text,
            options: form.options.filter((o) => o.trim() !== ''),
            correctAnswerIndex: Number(form.correctAnswerIndex),
        };
        if (editingId) {
            dispatch(updateQuestion({ id: editingId, data }));
        } else {
            dispatch(createQuestion(data));
        }
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(false);
    };

    const handleCancel = () => {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="px-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">My Questions</h5>
                {!showForm && (
                    <button className="btn btn-success btn-sm" onClick={() => setShowForm(true)}>
                        + Add Question
                    </button>
                )}
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            {showForm && (
                <div className="card shadow-sm mb-4 p-3">
                    <h6 className="mb-3">{editingId ? 'Edit Question' : 'New Question'}</h6>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <label className="form-label">Question Text</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.text}
                                onChange={(e) => setForm({ ...form, text: e.target.value })}
                                required
                            />
                        </div>

                        <label className="form-label">Options</label>
                        {form.options.map((opt, i) => (
                            <div key={i} className="input-group mb-2">
                                <span className="input-group-text">{i + 1}</span>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={opt}
                                    onChange={(e) => handleOptionChange(i, e.target.value)}
                                    placeholder={`Option ${i + 1}`}
                                />
                            </div>
                        ))}

                        <div className="mb-3">
                            <label className="form-label">Correct Answer (0-indexed)</label>
                            <input
                                type="number"
                                className="form-control"
                                style={{ width: '120px' }}
                                min={0}
                                max={3}
                                value={form.correctAnswerIndex}
                                onChange={(e) => setForm({ ...form, correctAnswerIndex: e.target.value })}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-sm me-2">
                            {editingId ? 'Update' : 'Create'}
                        </button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={handleCancel}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            {isLoading && <p className="text-muted">Loading...</p>}

            {!isLoading && myQuestions.length === 0 && !showForm && (
                <p className="text-muted">You haven't created any questions yet.</p>
            )}

            {myQuestions.length > 0 && (
                <div className="table-responsive">
                    <table className="table table-bordered table-sm">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Question</th>
                                <th>Options</th>
                                <th>Correct</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myQuestions.map((q, idx) => (
                                <tr key={q._id}>
                                    <td>{idx + 1}</td>
                                    <td>{q.text}</td>
                                    <td>{q.options.join(' / ')}</td>
                                    <td>{q.options[q.correctAnswerIndex]}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-1"
                                            onClick={() => handleEdit(q)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(q._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default MyQuestionsPage;
