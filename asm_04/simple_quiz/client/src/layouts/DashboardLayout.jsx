import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

function DashboardLayout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center px-4 pt-4 pb-2">
                <h1 className="fw-bold mb-0">{user?.admin ? 'Admin Dashboard' : 'User Dashboard'}</h1>
                <span>Welcome, {user?.username}</span>
            </div>

            <nav className="bg-light px-4 py-2 mb-4">
                <ul className="nav">
                    <li className="nav-item">
                        <Link
                            className={`nav-link ${isActive('/dashboard') ? 'text-dark fw-semibold' : 'text-muted'}`}
                            to="/dashboard"
                        >
                            Home
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className={`nav-link ${isActive('/dashboard/quiz') ? 'text-dark fw-semibold' : 'text-muted'}`}
                            to="/dashboard/quiz"
                        >
                            Quiz
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className={`nav-link ${isActive('/dashboard/questions') ? 'text-dark fw-semibold' : 'text-muted'}`}
                            to="/dashboard/questions"
                        >
                            My Questions
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className={`nav-link ${isActive('/dashboard/article') ? 'text-dark fw-semibold' : 'text-muted'}`}
                            to="/dashboard/article"
                        >
                            Article
                        </Link>
                    </li>
                    <li className="nav-item ms-auto">
                        <button className="nav-link btn btn-link text-muted p-0" onClick={handleLogout}>
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>

            <Outlet />
        </div>
    );
}

export default DashboardLayout;
