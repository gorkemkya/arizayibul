import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function supabaseServer() {
  const cookieStore = cookies(); // Next.js'in cookies API'si

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Not: Sunucu bileşeninden çağrılırsa burada hata atabilir, 
            // ancak middleware ile oturum yenilemesi yapılacağı için bu göz ardı edilebilir.
          }
        },
      },
    }
  );
}
