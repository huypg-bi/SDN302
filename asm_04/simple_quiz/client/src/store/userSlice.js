import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to fetch users');
    }
});

const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default userSlice.reducer;
