import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Önce response nesnesini oluşturuyoruz
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Supabase istemcisini oluşturuyoruz
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Kullanıcı oturumunu kontrol ediyoruz
  // Not: Middleware'de getSession yerine getUser kullanmak daha güvenlidir.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isLoggedIn = !!user
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')

  // 4. Yönlendirme mantığı
  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Aşağıdaki yollar hariç tüm request yollarını eşleştir:
     * - _next/static (static dosyalar)
     * - _next/image (görsel optimizasyon dosyaları)
     * - favicon.ico (tarayıcı ikonu)
     * - images veya public klasöründeki dosyalarınız varsa onları da ekleyebilirsiniz.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}