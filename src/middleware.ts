import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Verificar se é uma rota administrativa
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Permitir acesso à página de login
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }
    
    // Verificar autenticação para outras rotas administrativas
    // Verificar cookie de autenticação
    const isAuthenticatedCookie = request.cookies.get('adminAuthenticated')
    
    // Se não estiver autenticado por cookie, redirecionar para login
    if (!isAuthenticatedCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}