import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const authRoutes = [
    "/signup",
    "/login",
    "/forgot-password",
    "/verify-otp",
    "/reset-password",
];

// Pre-encode the secret once outside the handler
const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "your-jwt-secret"
);

interface TokenPayload {
    role?: string;
    [key: string]: unknown;
}

export async function middleware(request: NextRequest) {
    const { pathname, origin } = request.nextUrl;
    const isAuthRoute = authRoutes.includes(pathname);

    // 1. Retrieve the token from cookies
    const token = request.cookies.get("accessToken")?.value;

    // 2. Unauthenticated user handling
    if (!token) {
        if (isAuthRoute) {
            return NextResponse.next();
        }
        const loginUrl = new URL(`/login?redirect=${pathname}`, origin);
        return NextResponse.redirect(loginUrl);
    }

    // 3. Cryptographically verify the token locally (zero network calls)
    let payload: TokenPayload;
    try {
        const verified = await jwtVerify<TokenPayload>(token, JWT_SECRET);
        payload = verified.payload;
    } catch (error) {
        // Token is invalid, expired, or tampered with
        if (isAuthRoute) {
            const response = NextResponse.next();
            response.cookies.delete("accessToken"); // Clear invalid cookie from browser
            return response;
        }

        const loginUrl = new URL(`/login?redirect=${pathname}`, origin);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("accessToken"); // Clear invalid cookie from browser
        return response;
    }

    // 4. Authenticated users should not revisit login/auth pages
    if (isAuthRoute) {
        return NextResponse.redirect(new URL("/", origin));
    }

    // 5. Pass all authenticated users
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Auth Routes:
         * - Matches /login, /signup, /forgot-password, /reset-password, /verify-otp
         *   plus any nested sub-routes (e.g., /verify-otp/step-2)
         */
        "/(login|signup|forgot-password|reset-password|verify-otp)(/.*)?",

        /*
         * Private Routes:
         * - Matches /employer, /worker, /inbox, /notifications
         *   plus all sub-paths (e.g., /employer/jobs, /worker/profile/edit)
         */
        "/(employer|worker|inbox|notifications)(/.*)?",
    ],
};