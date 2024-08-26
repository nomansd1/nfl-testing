import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers'
export function setCookieWithDefaults(key: string, value: string, options = {}) {
    const defaultOptions = {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production', // Only set Secure for production
        sameSite: 'lax',
    };

    options = { ...defaultOptions, options }

    cookies().set(key, value, options)
}

export function getCookieBykey(key: string): RequestCookie | undefined {
    return cookies().get(key)
}

export function clearAllCookies() {
    cookies().getAll().forEach((key) => {
        cookies().delete(key);
    })
}

export enum enCookie {
    auth = "_auth",
    info = "_u",
    container = "_c"
}