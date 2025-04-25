import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define public paths that don't require authentication
const publicPaths = ['/landing', '/login', '/signup']

export function middleware(request: NextRequest) {
  // Get the path from the URL
  const path = request.nextUrl.pathname
  
  // Get the authentication token from cookies
  const authToken = request.cookies.get('authToken')?.value
  
  // Check if the path is public (no auth required)
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path === `${publicPath}/`
  )
  
  // Special case for home route
  if (path === '/' || path === '') {
    return NextResponse.redirect(new URL('/landing', request.url))
  }
  
  // Check if the user is trying to access a protected route without being authenticated
  if (!authToken && !isPublicPath) {
    return NextResponse.redirect(new URL('/landing', request.url))
  }
  
  // Check if the user is authenticated and trying to access login/signup
  if (authToken && isPublicPath && path !== '/landing') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Allow the request to proceed
  return NextResponse.next()
}

// Define path patterns to apply the middleware to
export const config = {
  matcher: [
    // Apply to all paths except api routes, static files, etc.
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
}

