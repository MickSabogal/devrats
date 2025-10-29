// middleware.js
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        const publicRoutes = ["/login", "/register"];
        const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
        
        if (token && isPublicRoute) {
          return false;
        }
        
        if (!token && !isPublicRoute && pathname !== "/") {
          return false;
        }
        
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (already protected in each route)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|banner.png|mock.png).*)",
  ],
};