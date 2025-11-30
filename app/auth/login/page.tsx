'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    setError(error.message)
    return
  }

  const { session } = data
  if (session) {
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    })
  }

  console.log("Login başarılı")
  // Tam sayfa yönlendirme (router.push yerine bu çalışır)
  window.location.href = '/dashboard'
}

  return (
    <form onSubmit={handleLogin}>
      <h1 className="text-2xl font-semibold mb-4">Giriş Yap</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full border p-2 mb-2"
      />
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full border p-2 mb-4"
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-2">Giriş Yap</button>
    </form>
  )
}
