import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchQuizzes } from '../store/quizSlice';

function DashboardHome() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { quizzes, isLoading } = useSelector((state) => state.quiz);

    useEffect(() => {
        dispatch(fetchQuizzes());
    }, [dispatch]);

    return (
        <div className="px-4">
            {isLoading && <p className="text-muted">Loading quizzes...</p>}
            {!isLoading && quizzes.length === 0 && (
                <p className="text-muted">No quizzes available.</p>
            )}
            {quizzes.length > 0 && (
                <div className="row g-3">
                    {quizzes.map((quiz) => (
                        <div className="col-md-4" key={quiz._id}>
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{quiz.title}</h5>
                                    {quiz.description && (
                                        <p className="card-text text-muted">{quiz.description}</p>
                                    )}
                                    <p className="card-text">
                                        <small className="text-muted">{quiz.questions?.length || 0} questions</small>
                                    </p>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => navigate('/dashboard/quiz', { state: { quizId: quiz._id } })}
                                    >
                                        Take Quiz
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DashboardHome;
