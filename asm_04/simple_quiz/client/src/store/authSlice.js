import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const savedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
const savedToken = localStorage.getItem('token') || null;

export const loginUser = createAsyncThunk('auth/login', async ({ username, password }, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/users/login`, { username, password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
    }
});

export const registerUser = createAsyncThunk('auth/register', async ({ username, password }, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/users/signup`, { username, password });
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.error || 'Registration failed');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: savedUser,
        token: savedToken,
        isLoading: false,
        error: null,
        registerSuccess: false,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        clearError: (state) => {
            state.error = null;
        },
        clearRegisterSuccess: (state) => {
            state.registerSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.registerSuccess = false;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
                state.registerSuccess = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, clearError, clearRegisterSuccess } = authSlice.actions;
export default authSlice.reducer;
