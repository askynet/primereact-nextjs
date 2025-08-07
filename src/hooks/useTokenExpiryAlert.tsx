import { useEffect } from "react";
import { getTokenExpiry } from "../utils/utils";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export const useTokenExpiryAlert = (showAlert: (forceLogout?: boolean) => void, alertBeforeMs: number = 60000) => {
    const { isLoggedIn } = useSelector((state: RootState) => state.auth);
    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }
        const expiryTime = getTokenExpiry();
        if (!expiryTime) return;

        const now = Date.now();

        if (expiryTime < now) {
            showAlert(true);
            return;
        }

        const timeout = expiryTime - now - alertBeforeMs;
        if (timeout <= 0) {
            showAlert();
            return;
        }

        const timer = setTimeout(() => {
            showAlert();
        }, timeout);

        return () => clearTimeout(timer);
    }, [alertBeforeMs, showAlert]);
};
