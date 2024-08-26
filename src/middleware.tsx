import { enCookie, getCookieBykey } from "@/lib/utilities/cookies-helper";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/portal')) {

        const authToken = getCookieBykey(enCookie.auth);

        if (!authToken) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        else {
            //request.headers.set('Authorization', `Bearer ${authToken.value}`);
        }
    }
    else if (request.nextUrl.pathname === "/") {
        //console.log(`Redirect user to Portal from Address > ${request.nextUrl.pathname}!`);
        const authToken = getCookieBykey(enCookie.auth)
        if (authToken) {
            return NextResponse.redirect(new URL('/portal', request.url));
        }
    }
}