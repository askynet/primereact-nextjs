import { useEffect } from "react";
import { getTokenExpiry } from "../utils/utils";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export const useTokenExpiryAlert = (showAlert: () => void, alertBeforeMs: number = 60000) => {
    const { isLoggedIn } = useSelector((state: RootState) => state.auth);
    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }
        const expiryTime = getTokenExpiry();
        if (!expiryTime) return;

        const now = Date.now();
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
