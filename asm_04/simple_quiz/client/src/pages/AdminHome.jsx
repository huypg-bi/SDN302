import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchQuizzes, createQuiz, updateQuiz, deleteQuiz } from '../store/quizSlice';

const emptyForm = { title: '', description: '' };

function AdminHome() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { quizzes, isLoading, error } = useSelector((state) => state.quiz);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        dispatch(fetchQuizzes());
    }, [dispatch]);

    const handleEdit = (quiz) => {
        setForm({ title: quiz.title, description: quiz.description || '' });
        setEditingId(quiz._id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this quiz and all its questions?')) {
            dispatch(deleteQuiz(id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            dispatch(updateQuiz({ id: editingId, data: form }));
        } else {
            dispatch(createQuiz(form));
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
                <h5 className="mb-0">Quizzes</h5>
                {!showForm && (
                    <button className="btn btn-success btn-sm" onClick={() => setShowForm(true)}>
                        + New Quiz
                    </button>
                )}
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            {showForm && (
                <div className="card shadow-sm mb-4 p-3">
                    <h6 className="mb-3">{editingId ? 'Edit Quiz' : 'New Quiz'}</h6>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                rows={2}
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
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

            {!isLoading && quizzes.length === 0 && !showForm && (
                <p className="text-muted">No quizzes yet.</p>
            )}

            {quizzes.map((quiz) => (
                <div key={quiz._id} className="card mb-2 shadow-sm">
                    <div className="card-body d-flex justify-content-between align-items-center py-2">
                        <div>
                            <strong>{quiz.title}</strong>
                            {quiz.description && (
                                <span className="text-muted ms-2 small">{quiz.description}</span>
                            )}
                            <span className="text-muted ms-2 small">
                                ({quiz.questions?.length || 0} questions)
                            </span>
                        </div>
                        <div>
                            <button
                                className="btn btn-primary btn-sm me-1"
                                onClick={() => navigate(`/admin/quizzes/${quiz._id}/questions`)}
                            >
                                Questions ({quiz.questions?.length || 0})
                            </button>
                            <button
                                className="btn btn-warning btn-sm me-1"
                                onClick={() => handleEdit(quiz)}
                            >
                                Edit
                            </button>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(quiz._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AdminHome;
