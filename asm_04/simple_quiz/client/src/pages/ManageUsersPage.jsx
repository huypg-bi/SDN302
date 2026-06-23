import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../store/userSlice';

function ManageUsersPage() {
    const dispatch = useDispatch();
    const { users, isLoading, error } = useSelector((state) => state.users);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    return (
        <div className="px-4">
            <h5 className="mb-3">Manage Users</h5>

            {error && <div className="alert alert-danger py-2">{error}</div>}
            {isLoading && <p className="text-muted">Loading...</p>}

            {!isLoading && users.length === 0 && (
                <p className="text-muted">No users found.</p>
            )}

            {users.length > 0 && (
                <table className="table table-bordered table-sm">
                    <thead className="table-light">
                        <tr>
                            <th>#</th>
                            <th>Username</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u, idx) => (
                            <tr key={u._id}>
                                <td>{idx + 1}</td>
                                <td>{u.username}</td>
                                <td>
                                    <span className={`badge ${u.admin ? 'bg-danger' : 'bg-secondary'}`}>
                                        {u.admin ? 'Admin' : 'User'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ManageUsersPage;
