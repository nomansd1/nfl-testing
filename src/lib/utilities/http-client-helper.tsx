import { enCookie, getCookieBykey } from "./cookies-helper"

export function GetHeaderWithToken() {   
    let token = GetToken();
    let header = {
        "content-type": "application/json",
        "Authorization": `Bearer ${token}`
    }
    return header;
}

export function GetToken() {
    return JSON.parse(getCookieBykey(enCookie.auth)?.value as string)?.token;    
}

export function GetContainerInfo() {
    return JSON.parse(getCookieBykey(enCookie.auth)?.value as string)?.container;    
}

export const DEFAULT_REVALIDATE_IN_MINUTES = 3600;