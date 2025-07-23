import { NextRequest, NextResponse } from 'next/server';

const restrictedRoutesAfterLogin=["/auth/login","/auth/register/user","/auth/register/admin"]

export function middleware(req: NextRequest) {
  const token = req.cookies.get(process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_KEY||"tl_refreshtoken")?.value;
  // Protect all /dashboard routes
  if (!token){
    if (req.nextUrl.pathname.includes('/dashboard') || req.nextUrl.pathname == "/"   ) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    if(req.nextUrl.pathname == "/auth" ){
      return NextResponse.redirect(new URL('/auth/signup/admin', req.url));
    }
  }
  else {
    // If the user is logged in, redirect from /auth to /dashboard
    if (restrictedRoutesAfterLogin.includes(req.nextUrl.pathname) ) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }
    return NextResponse.next();
}

export const config ={
    matcher:["/dashboard/:path*","/dashboard","/auth/:path*","/auth","/"]
}
