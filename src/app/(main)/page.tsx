'use client';

import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'primereact/button';
import { RootState } from '@/src/redux/store';
import { login, logout } from '@/src/redux/slices/authSlice';
import AppPage from '@/src/layout/AppPage';

export default function TerminalPage() {
    const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    return (
        <AppPage>
            {isLoggedIn ? (
                <>
                    <p>Welcome</p>
                    <Button label="Logout" onClick={() => dispatch(logout())} />
                </>
            ) : (
                <Button label="Login as Admin" onClick={() => dispatch(login('Admin'))} />
            )}
        </AppPage>
    );
}
