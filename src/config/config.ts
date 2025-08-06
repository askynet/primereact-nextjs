'use client';

const DOMAIN_NAME = 'exuudapp.com';
const getBaseUrl = (): string => {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;

        if (hostname === 'localhost') {
            return 'http://localhost:8002/api';
        } else if (
            hostname === `dev.${DOMAIN_NAME}` ||
            hostname === `dev-portal.${DOMAIN_NAME}`
        ) {
            return `https://dev-api.${DOMAIN_NAME}/api`;
        } else {
            return `https://api.${DOMAIN_NAME}/api`; // Production
        }
    }

    return `https://api.${DOMAIN_NAME}/api`;
};

export const CONFIG = {
    APP_NAME: 'Demo',
    get BASE_URL() {
        return getBaseUrl(); // Call lazily
    },
    APP_URL: `https://${DOMAIN_NAME}`,
    AUTH_USER: 'AUTH_USER',
    AUTH_USER_TOKEN: 'AUTH_USER_TOKEN',
    AUTH_USER_REFRESH_TOKEN: 'AUTH_USER_REFRESH_TOKEN',
}