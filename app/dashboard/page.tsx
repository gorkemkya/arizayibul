// app/dashboard/page.tsx
import { supabaseServer } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="p-4">
      {user ? (
        <h1>Hoş geldin, {user.email}!</h1>
      ) : (
        <p>Kullanıcı bulunamadı.</p>
      )}
    </div>
  );
}
