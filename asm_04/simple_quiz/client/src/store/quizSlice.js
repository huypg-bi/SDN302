import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

export const fetchQuizzes = createAsyncThunk('quiz/fetchAll', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${API_URL}/quizzes/api/quizzes`);
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to fetch quizzes');
    }
});

export const createQuiz = createAsyncThunk('quiz/create', async (data, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/quizzes/api/quizzes`, data, {
            headers: authHeader(),
        });
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to create quiz');
    }
});

export const updateQuiz = createAsyncThunk('quiz/update', async ({ id, data }, thunkAPI) => {
    try {
        const response = await axios.put(`${API_URL}/quizzes/api/quizzes/${id}`, data, {
            headers: authHeader(),
        });
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to update quiz');
    }
});

export const deleteQuiz = createAsyncThunk('quiz/delete', async (id, thunkAPI) => {
    try {
        await axios.delete(`${API_URL}/quizzes/api/quizzes/${id}`, {
            headers: authHeader(),
        });
        return id;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to delete quiz');
    }
});

// POST /quizzes/:quizId/question — tạo question mới và thêm thẳng vào quiz
export const addNewQuestionToQuiz = createAsyncThunk('quiz/addNewQuestion', async ({ quizId, questionData }, thunkAPI) => {
    try {
        const response = await axios.post(
            `${API_URL}/quizzes/api/quizzes/${quizId}/question`,
            questionData,
            { headers: authHeader() }
        );
        return { quizId, question: response.data };
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to add question');
    }
});

// PUT /quizzes/:quizId — thêm question có sẵn từ pool vào quiz
export const addExistingQuestionToQuiz = createAsyncThunk('quiz/addExistingQuestion', async ({ quizId, question, currentQuestions }, thunkAPI) => {
    try {
        const updatedIds = [...currentQuestions.map(q => q._id), question._id];
        await axios.put(`${API_URL}/quizzes/api/quizzes/${quizId}`, { questions: updatedIds }, {
            headers: authHeader(),
        });
        return { quizId, question };
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to add question to quiz');
    }
});

// PUT /quizzes/:quizId — xóa question khỏi quiz (không xóa question khỏi DB)
export const removeQuestionFromQuiz = createAsyncThunk('quiz/removeQuestion', async ({ quizId, questionId, currentQuestions }, thunkAPI) => {
    try {
        const updatedIds = currentQuestions.filter(q => q._id !== questionId).map(q => q._id);
        await axios.put(`${API_URL}/quizzes/api/quizzes/${quizId}`, { questions: updatedIds }, {
            headers: authHeader(),
        });
        return { quizId, questionId };
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to remove question');
    }
});

const quizSlice = createSlice({
    name: 'quiz',
    initialState: {
        quizzes: [],
        currentQuiz: null,
        currentQuestionIndex: 0,
        selectedAnswer: null,
        score: 0,
        isCompleted: false,
        isLoading: false,
        error: null,
    },
    reducers: {
        startQuiz: (state, action) => {
            state.currentQuiz = action.payload;
            state.currentQuestionIndex = 0;
            state.selectedAnswer = null;
            state.score = 0;
            state.isCompleted = false;
        },
        selectAnswer: (state, action) => {
            state.selectedAnswer = action.payload;
        },
        submitAnswer: (state) => {
            const question = state.currentQuiz.questions[state.currentQuestionIndex];
            if (state.selectedAnswer === question.correctAnswerIndex) {
                state.score += 1;
            }
            if (state.currentQuestionIndex + 1 >= state.currentQuiz.questions.length) {
                state.isCompleted = true;
            } else {
                state.currentQuestionIndex += 1;
                state.selectedAnswer = null;
            }
        },
        restartQuiz: (state) => {
            state.currentQuestionIndex = 0;
            state.selectedAnswer = null;
            state.score = 0;
            state.isCompleted = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuizzes.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(fetchQuizzes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.quizzes = action.payload;
            })
            .addCase(fetchQuizzes.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(createQuiz.fulfilled, (state, action) => {
                state.quizzes.push(action.payload);
            })
            .addCase(updateQuiz.fulfilled, (state, action) => {
                const idx = state.quizzes.findIndex(q => q._id === action.payload._id);
                if (idx !== -1) state.quizzes[idx] = action.payload;
            })
            .addCase(deleteQuiz.fulfilled, (state, action) => {
                state.quizzes = state.quizzes.filter(q => q._id !== action.payload);
            })
            .addCase(addNewQuestionToQuiz.fulfilled, (state, action) => {
                const { quizId, question } = action.payload;
                const quiz = state.quizzes.find(q => q._id === quizId);
                if (quiz) quiz.questions.push(question);
            })
            .addCase(addExistingQuestionToQuiz.fulfilled, (state, action) => {
                const { quizId, question } = action.payload;
                const quiz = state.quizzes.find(q => q._id === quizId);
                if (quiz) quiz.questions.push(question);
            })
            .addCase(removeQuestionFromQuiz.fulfilled, (state, action) => {
                const { quizId, questionId } = action.payload;
                const quiz = state.quizzes.find(q => q._id === quizId);
                if (quiz) quiz.questions = quiz.questions.filter(q => q._id !== questionId);
            });
    },
});

export const { startQuiz, selectAnswer, submitAnswer, restartQuiz } = quizSlice.actions;
export default quizSlice.reducer;
