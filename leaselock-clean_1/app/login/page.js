'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Logo from '../components/Logo'
import { createClient } from '../lib/supabase/client'

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

function LoginInner() {
  const params = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const redirect = params.get('redirect') || '/app'

  async function signInWithGoogle() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', border: '1px solid var(--line)', borderRadius: 20, padding: '40px 32px', boxShadow: '0 12px 40px rgba(12,27,31,.06)' }}>
        <Link href="/" className="brand" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 20, textDecoration: 'none', color: 'var(--ink)' }}>
          <Logo size={34} />
          <span>Renter<span style={{ color: 'var(--brand)' }}>Ready</span></span>
        </Link>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, margin: '28px 0 8px' }}>Sign in to your protection</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, marginBottom: 28 }}>
          Log in to access your dashboard, lease reviews, move-in reports, and everything that keeps your deposit safe.
        </p>

        <button
          onClick={signInWithGoogle}
          disabled={loading}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            padding: '13px 16px', borderRadius: 12, border: '1.5px solid var(--line-strong)',
            background: '#fff', color: 'var(--ink)', fontWeight: 600, fontSize: 15.5,
            cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.6 : 1,
          }}
        >
          <GoogleMark />
          {loading ? 'Redirecting…' : 'Continue with Google'}
        </button>

        {error && (
          <div style={{ marginTop: 16, background: '#fdecea', color: '#b3261e', border: '1px solid #f5c6c2', borderRadius: 10, padding: '10px 14px', fontSize: 13.5 }}>
            {error}
          </div>
        )}

        <p style={{ marginTop: 24, fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
          By continuing you agree to keep your renter records private to your account. This is not legal advice.
        </p>

        <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--line)', fontSize: 14 }}>
          <Link href="/" style={{ color: 'var(--ink-soft)' }}>← Back to home</Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  )
}
