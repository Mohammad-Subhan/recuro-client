"use client"

import { useAppSelector } from '@/store/hooks'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const PUBLIC_ROUTES = ["/"];
const AUTH_ROUTES_PREFIX = "/auth";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAppSelector(state => state.auth);
    const router = useRouter();
    const pathname = usePathname();
    const [isReady, setIsReady] = useState(false);

    const isAuthRoute = pathname.startsWith(AUTH_ROUTES_PREFIX);
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    useEffect(() => {
        if (isAuthenticated && isAuthRoute) {
            // Logged in user trying to access auth pages → redirect to dashboard
            router.replace("/dashboard");
            return;
        }

        if (!isAuthenticated && !isAuthRoute && !isPublicRoute) {
            // Not logged in trying to access protected pages → redirect to login
            router.replace("/auth/login");
            return;
        }

        setIsReady(true);
    }, [isAuthenticated, isAuthRoute, isPublicRoute, router, pathname]);

    // Reset ready state on route change to re-evaluate
    useEffect(() => {
        setIsReady(false);

        const shouldRedirect =
            (isAuthenticated && isAuthRoute) ||
            (!isAuthenticated && !isAuthRoute && !isPublicRoute);

        if (!shouldRedirect) {
            setIsReady(true);
        }
    }, [pathname, isAuthenticated, isAuthRoute, isPublicRoute]);

    // Prevent flash of wrong content while redirecting
    if (!isReady) return null;

    return <>{children}</>;
}

export default AuthGuard
