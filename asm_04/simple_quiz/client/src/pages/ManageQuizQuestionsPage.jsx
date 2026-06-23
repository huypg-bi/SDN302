import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizzes, addNewQuestionToQuiz, addExistingQuestionToQuiz, removeQuestionFromQuiz } from '../store/quizSlice';
import { fetchQuestions } from '../store/questionSlice';

const emptyForm = { text: '', options: ['', '', '', ''], correctAnswerIndex: 0 };

function ManageQuizQuestionsPage() {
    const { quizId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { quizzes, isLoading, error } = useSelector((state) => state.quiz);
    const { questions: allQuestions } = useSelector((state) => state.questions);

    const [tab, setTab] = useState('new'); // 'new' | 'pool'
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        dispatch(fetchQuizzes());
        dispatch(fetchQuestions());
    }, [dispatch]);

    const quiz = quizzes.find(q => q._id === quizId);
    const quizQuestionIds = quiz ? quiz.questions.map(q => q._id) : [];
    const pool = allQuestions.filter(q => !quizQuestionIds.includes(q._id));

    const handleOptionChange = (index, value) => {
        const updated = [...form.options];
        updated[index] = value;
        setForm({ ...form, options: updated });
    };

    const handleAddNew = (e) => {
        e.preventDefault();
        const data = {
            text: form.text,
            options: form.options.filter(o => o.trim() !== ''),
            correctAnswerIndex: Number(form.correctAnswerIndex),
        };
        dispatch(addNewQuestionToQuiz({ quizId, questionData: data }));
        setForm(emptyForm);
        setShowForm(false);
    };

    const handleAddFromPool = (question) => {
        dispatch(addExistingQuestionToQuiz({
            quizId,
            question,
            currentQuestions: quiz.questions,
        }));
    };

    const handleRemove = (questionId) => {
        if (window.confirm('Remove this question from the quiz?')) {
            dispatch(removeQuestionFromQuiz({
                quizId,
                questionId,
                currentQuestions: quiz.questions,
            }));
        }
    };

    if (isLoading) return <div className="px-4"><p className="text-muted">Loading...</p></div>;
    if (!quiz) return <div className="px-4"><p className="text-danger">Quiz not found.</p></div>;

    return (
        <div className="px-4">
            <div className="mb-3">
                <button className="btn btn-link p-0 text-muted small" onClick={() => navigate('/admin')}>
                    &larr; Back to Quizzes
                </button>
            </div>

            <div className="mb-4">
                <h5 className="mb-0">{quiz.title}</h5>
                {quiz.description && <p className="text-muted small mb-0">{quiz.description}</p>}
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            {/* Danh sách questions hiện có trong quiz */}
            <div className="mb-4">
                <h6 className="mb-2">Questions in this quiz ({quiz.questions.length})</h6>
                {quiz.questions.length === 0 ? (
                    <p className="text-muted small">No questions yet.</p>
                ) : (
                    <table className="table table-bordered table-sm">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Question</th>
                                <th>Options</th>
                                <th>Correct</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quiz.questions.map((q, idx) => (
                                <tr key={q._id}>
                                    <td>{idx + 1}</td>
                                    <td>{q.text}</td>
                                    <td>{q.options.join(' / ')}</td>
                                    <td>{q.options[q.correctAnswerIndex]}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleRemove(q._id)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Thêm question */}
            <div>
                <div className="d-flex align-items-center gap-2 mb-3">
                    <h6 className="mb-0">Add Question</h6>
                    <div className="btn-group btn-group-sm">
                        <button
                            className={`btn ${tab === 'new' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => { setTab('new'); setShowForm(false); }}
                        >
                            Create New
                        </button>
                        <button
                            className={`btn ${tab === 'pool' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setTab('pool')}
                        >
                            From Pool ({pool.length})
                        </button>
                    </div>
                </div>

                {tab === 'new' && (
                    <>
                        {!showForm && (
                            <button className="btn btn-success btn-sm" onClick={() => setShowForm(true)}>
                                + New Question
                            </button>
                        )}
                        {showForm && (
                            <div className="card shadow-sm p-3">
                                <form onSubmit={handleAddNew}>
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
                                    <button type="submit" className="btn btn-primary btn-sm me-2">Add to Quiz</button>
                                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setShowForm(false); setForm(emptyForm); }}>
                                        Cancel
                                    </button>
                                </form>
                            </div>
                        )}
                    </>
                )}

                {tab === 'pool' && (
                    pool.length === 0 ? (
                        <p className="text-muted small">No available questions in the pool.</p>
                    ) : (
                        <table className="table table-bordered table-sm">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Question</th>
                                    <th>Options</th>
                                    <th>Correct</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pool.map((q, idx) => (
                                    <tr key={q._id}>
                                        <td>{idx + 1}</td>
                                        <td>{q.text}</td>
                                        <td>{q.options.join(' / ')}</td>
                                        <td>{q.options[q.correctAnswerIndex]}</td>
                                        <td>
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleAddFromPool(q)}
                                            >
                                                Add
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                )}
            </div>
        </div>
    );
}

export default ManageQuizQuestionsPage;
