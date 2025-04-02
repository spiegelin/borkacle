import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // For development, we're not enforcing any authentication
  // Just pass through all requests
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Add paths that would normally be protected
    "/dashboard/:path*",
    "/profile-settings/:path*",
    "/item/:path*",
  ],
}

