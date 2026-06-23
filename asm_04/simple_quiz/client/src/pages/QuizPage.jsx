import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchQuizzes, startQuiz, selectAnswer, submitAnswer, restartQuiz } from '../store/quizSlice';

function QuizPage() {
    const dispatch = useDispatch();
    const location = useLocation();
    const { quizzes, currentQuiz, currentQuestionIndex, selectedAnswer, score, isCompleted, isLoading } =
        useSelector((state) => state.quiz);

    useEffect(() => {
        if (quizzes.length === 0) {
            dispatch(fetchQuizzes());
        }
    }, [dispatch, quizzes.length]);

    useEffect(() => {
        if (quizzes.length > 0 && !currentQuiz) {
            const quizId = location.state?.quizId;
            const quiz = quizId ? quizzes.find((q) => q._id === quizId) : quizzes[0];
            if (quiz) dispatch(startQuiz(quiz));
        }
    }, [quizzes, currentQuiz, dispatch, location.state]);

    if (isLoading || !currentQuiz) {
        return <div className="text-center mt-5">Loading quiz...</div>;
    }

    if (currentQuiz.questions.length === 0) {
        return <div className="text-center mt-5 text-muted">This quiz has no questions yet.</div>;
    }

    if (isCompleted) {
        return (
            <div className="text-center mt-5">
                <h2 className="fw-bold">Quiz Completed</h2>
                <p className="mt-2">Your score: {score}</p>
                <button
                    className="btn btn-primary mt-3"
                    onClick={() => dispatch(restartQuiz())}
                >
                    Restart Quiz
                </button>
            </div>
        );
    }

    const question = currentQuiz.questions[currentQuestionIndex];

    return (
        <div className="text-center mt-4">
            <h3 className="mb-4">{currentQuiz.title}</h3>
            <h5 className="fw-bold mb-4">{question.text}</h5>

            <div className="d-inline-block text-start mb-4">
                {question.options.map((option, index) => (
                    <div key={index} className="form-check mb-2">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="answer"
                            id={`option-${index}`}
                            checked={selectedAnswer === index}
                            onChange={() => dispatch(selectAnswer(index))}
                        />
                        <label className="form-check-label" htmlFor={`option-${index}`}>
                            {option}
                        </label>
                    </div>
                ))}
            </div>

            <div>
                <button
                    className="btn btn-primary"
                    disabled={selectedAnswer === null}
                    onClick={() => dispatch(submitAnswer())}
                >
                    Submit Answer
                </button>
            </div>
        </div>
    );
}

export default QuizPage;
