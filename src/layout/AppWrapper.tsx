import { Toast } from 'primereact/toast';
import React from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AppContextType } from '../types';
import eventEmitter from '../api/event';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { useTokenExpiryAlert } from '../hooks/useTokenExpiryAlert';
import { Button } from 'primereact/button';
import axios from 'axios';
import { logout, setAuthRefreshToken, setAuthToken } from '../redux/slices/authSlice';
import { CONFIG } from '../config/config';

const defaultContext: AppContextType = {
    isLoading: true,
    setLoading: () => { },
    signOut: () => { },
    setAlert: (messgae: string, type?: string) => { },
    isScroll: true,
    setScroll: () => { },
    permissions: []
};
const AppContext = createContext(defaultContext);

export const AppWrapper = React.memo(({ children }: any) => {
    const dialogRef = useRef<any>(null);
    const [isLoading, setLoading] = useState(false);
    const [isScroll, setScroll] = useState(false);

    const toastRef = useRef<any>(null);

    const dispatch = useDispatch<AppDispatch>();
    const { isLoggedIn, authToken, authRefreshToken, user, permissions } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        eventEmitter.on('signOut', (data: any) => {
            if (dialogRef.current) {
                dialogRef.current.hide();
            }
            signOut();
            setAlert('info', 'Session expired')
        });
        eventEmitter.on('token', (data: any) => {
            if (authToken != data) {
                dispatch(setAuthToken(data))
            }
        });
    }, [])

    const signOut = async (isManual = false) => {
        dispatch(logout())
    }

    const setAlert = (message: string, type = 'error') => {
        if (toastRef.current) {
            toastRef.current.clear(); // Clear existing toast
        }
        toastRef.current.show({ severity: type, detail: message || (type == 'error' ? 'Failed' : ''), life: 3000 });
    }

    const refreshAuthToken = async () => {
        try {
            const refreshToken = authRefreshToken;
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            // Make the refresh token request
            const response = await axios.post(`${CONFIG.BASE_URL}/auth/refresh-token`, {
                refreshToken,
            })

            const { data } = response.data;

            if (data.token) {
                dispatch(setAuthToken((data.token)))
            }
            if (data.refreshToken) {
                dispatch(setAuthRefreshToken(data.refreshToken))
            }
        } catch (error: any) {
            setAlert(error.message)
        }
    }

    const footer = (callback: any) => (
        <div className="flex justify-content-end gap-1 mt-1 mb-1">
            <Button label="Logout" icon="pi pi-sign-out" severity="danger" size="small" onClick={() => {
                signOut()
                callback.reject();
            }} />
            <Button label="Refresh" icon="pi pi-refresh" size="small" onClick={() => {
                refreshAuthToken()
                callback.accept();
            }} />
        </div>
    );

    const showTokenExpiryAlert = () => {
        if (!isLoggedIn || !user) {
            if (dialogRef.current) {
                dialogRef.current.hide();
            }
            return;
        }
        dialogRef.current = confirmDialog({
            message: `Your session is about to expire. Click Refresh to stay connected or Logout.`,
            header: "Session Expiring",
            icon: "pi pi-exclamation-triangle text-red",
            position: 'top-right',
            style: { width: '30vw' },
            breakpoints: { '1100px': '30vw', '960px': '100vw' },
            footer: footer
        });
    };
    // 2 min before expiry
    useTokenExpiryAlert(showTokenExpiryAlert, 2 * 60 * 1000);

    return (
        <AppContext.Provider value={{
            isLoading, setLoading,
            signOut,
            setAlert,
            isScroll,
            setScroll,
            permissions
        }}>
            <Toast className='erp-alert' position="top-center" ref={toastRef} style={{ zIndex: 9999999 }} />
            <ConfirmDialog />
            {isLoading && <div className='running-border'></div>}
            <div style={{ overflow: isScroll ? 'auto' : 'hidden', maxHeight: '100dvh' }}>
                {children}
            </div>
        </AppContext.Provider>
    );
})

export function useAppContext() {
    return useContext(AppContext);
}