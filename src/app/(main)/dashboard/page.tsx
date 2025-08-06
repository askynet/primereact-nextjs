'use client';

import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'primereact/button';
import { RootState } from '@/src/redux/store';
import { logout } from '@/src/redux/slices/authSlice';
import AppPage from '@/src/layout/AppPage';

export default function DashboardPage() {
    const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    return (
        <AppPage>
            <h1 className="text-2xl font-semibold mb-4">Terminal</h1>
            <div className="mb-4">
                <p>Welcome, {user}</p>
                <Button size='small' label="Logout" onClick={() => dispatch(logout())} />
            </div>
        </AppPage>
    );
}
