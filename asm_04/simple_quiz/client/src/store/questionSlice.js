import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

export const fetchQuestions = createAsyncThunk('questions/fetchAll', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${API_URL}/questions/api/questions`);
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to fetch questions');
    }
});

export const createQuestion = createAsyncThunk('questions/create', async (data, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/questions/api/questions`, data, {
            headers: authHeader(),
        });
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to create question');
    }
});

export const updateQuestion = createAsyncThunk('questions/update', async ({ id, data }, thunkAPI) => {
    try {
        const response = await axios.put(`${API_URL}/questions/api/questions/${id}`, data, {
            headers: authHeader(),
        });
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to update question');
    }
});

export const deleteQuestion = createAsyncThunk('questions/delete', async (id, thunkAPI) => {
    try {
        await axios.delete(`${API_URL}/questions/api/questions/${id}`, {
            headers: authHeader(),
        });
        return id;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to delete question');
    }
});

const questionSlice = createSlice({
    name: 'questions',
    initialState: {
        questions: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuestions.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(fetchQuestions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.questions = action.payload;
            })
            .addCase(fetchQuestions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(createQuestion.fulfilled, (state, action) => {
                state.questions.push(action.payload);
            })
            .addCase(updateQuestion.fulfilled, (state, action) => {
                const idx = state.questions.findIndex(q => q._id === action.payload._id);
                if (idx !== -1) state.questions[idx] = action.payload;
            })
            .addCase(deleteQuestion.fulfilled, (state, action) => {
                state.questions = state.questions.filter(q => q._id !== action.payload);
            });
    },
});

export default questionSlice.reducer;
