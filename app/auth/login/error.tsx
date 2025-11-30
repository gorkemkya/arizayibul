'use client'

export default function Error({ error }: { error: Error }) {
  return (
    <div style={{ padding: 20, color: 'red' }}>
      <h2>Hata oluştu:</h2>
      <pre>{error.message}</pre>
    </div>
  )
}
