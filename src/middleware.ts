import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    // Response oluştur
    const res = NextResponse.next()

    // Supabase client oluştur
    const supabase = createMiddlewareClient({ req: request, res })

    // Session'ı al ve yenile
    await supabase.auth.getSession()

    // Session'ı tekrar kontrol et
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Session error:', error)
    }

    // Debug log
    console.log('Auth Check:', {
      path: request.nextUrl.pathname,
      hasSession: !!session,
      email: session?.user?.email,
      cookies: request.cookies.getAll(),
    })

    // Auth gerektiren sayfalar için kontrol
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      if (!session) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
    }

    // Auth sayfaları için kontrol (login/register)
    if (['/auth/login', '/auth/register'].includes(request.nextUrl.pathname)) {
      if (session) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    return res
  } catch (error) {
    console.error('Middleware Error:', error)
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/login',
    '/auth/register',
  ],
} 