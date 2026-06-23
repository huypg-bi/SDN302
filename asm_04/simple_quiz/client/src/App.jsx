import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import QuizPage from './pages/QuizPage';
import ArticlePage from './pages/ArticlePage';
import MyQuestionsPage from './pages/MyQuestionsPage';
import AdminLayout from './layouts/AdminLayout';
import AdminHome from './pages/AdminHome';
import ManageQuestionsPage from './pages/ManageQuestionsPage';
import ManageArticlesPage from './pages/ManageArticlesPage';
import ManageUsersPage from './pages/ManageUsersPage';
import ManageQuizQuestionsPage from './pages/ManageQuizQuestionsPage';

function RequireAuth({ children }) {
    const { token } = useSelector((state) => state.auth);
    if (!token) return <Navigate to="/login" replace />;
    return children;
}

function RequireAdmin({ children }) {
    const { token, user } = useSelector((state) => state.auth);
    if (!token) return <Navigate to="/login" replace />;
    if (!user?.admin) return <Navigate to="/dashboard" replace />;
    return children;
}

function RedirectIfLoggedIn({ children }) {
    const { token, user } = useSelector((state) => state.auth);
    if (token && user) return <Navigate to={user.admin ? '/admin' : '/dashboard'} replace />;
    return children;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<RedirectIfLoggedIn><LoginPage /></RedirectIfLoggedIn>} />
                <Route path="/register" element={<RedirectIfLoggedIn><RegisterPage /></RedirectIfLoggedIn>} />

                <Route path="/dashboard" element={<RequireAuth><DashboardLayout /></RequireAuth>}>
                    <Route index element={<DashboardHome />} />
                    <Route path="quiz" element={<QuizPage />} />
                    <Route path="questions" element={<MyQuestionsPage />} />
                    <Route path="article" element={<ArticlePage />} />
                </Route>

                <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
                    <Route index element={<AdminHome />} />
                    <Route path="questions" element={<ManageQuestionsPage />} />
                    <Route path="articles" element={<ManageArticlesPage />} />
                    <Route path="users" element={<ManageUsersPage />} />
                    <Route path="quizzes/:quizId/questions" element={<ManageQuizQuestionsPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
