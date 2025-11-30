'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
    } else if (data.session) {
      router.push('/dashboard')
    } else {
      setError('Oturum açılamadı, lütfen tekrar deneyin.')
    }
  }

  return (
    <form onSubmit={handleSignup} className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h1 className="text-2xl font-semibold mb-4">Kayıt Ol</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full border p-2 mb-2 rounded"
        required
      />

      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
        required
      />

      <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
        Kayıt Ol
      </button>
    </form>
  )
}
