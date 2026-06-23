import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import quizReducer from './quizSlice';
import questionReducer from './questionSlice';
import userReducer from './userSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        quiz: quizReducer,
        questions: questionReducer,
        users: userReducer,
    },
});
