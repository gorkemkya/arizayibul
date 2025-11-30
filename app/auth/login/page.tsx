'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('Login error:', error.message);
      setError(error.message);
    } else {
      console.log('Login başarılı');
      router.replace('/dashboard'); // veya yönlendirmek istediğin başka bir sayfa
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-4">Giriş Yap</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full border p-2 mb-2"
        required
      />
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-2">
        Giriş Yap
      </button>
    </form>
  );
}
