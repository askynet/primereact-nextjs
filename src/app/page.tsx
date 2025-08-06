'use client';

import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'primereact/button';
import { RootState } from '../redux/store';
import { login, logout } from '../redux/slices/authSlice';

export default function TerminalPage() {
    const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Terminal</h1>
            <div className="mb-4">
                {isLoggedIn ? (
                    <>
                        <p>Welcome, {user}</p>
                        <Button label="Logout" onClick={() => dispatch(logout())} />
                    </>
                ) : (
                    <Button label="Login as Admin" onClick={() => dispatch(login('Admin'))} />
                )}
            </div>
        </div>
    );
}
