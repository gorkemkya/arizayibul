import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  // Varsayılan yanıt, isteğe devam etmesi için NextResponse.next()
  let response = NextResponse.next();

  // Sunucu tarafı Supabase istemcisi oluştur (cookie'lerle)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Yeni cookie değerlerini hem isteğe hem yanıta ekle
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Mevcut JWT'nin geçerli olup olmadığını kontrol et (sunucu tarafında doğrulanır)
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  const pathname = request.nextUrl.pathname;

  // Korunması gereken rotaları tanımla:
  const PROTECTED_ROUTES = ['/dashboard', '/checkout', '/profile'];
  const isProtected = PROTECTED_ROUTES.some(path => pathname.startsWith(path));

  // Eğer kullanıcı login değilse ve korumalı rotaya erişmeye çalışıyorsa, login sayfasına yönlendir:
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return response;
}
