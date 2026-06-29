import { NextResponse } from 'next/server'
import { createClient } from '../../lib/supabase/server'

// Exchanges the OAuth `code` for a session, then redirects into the app.
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirect = searchParams.get('redirect') || '/app'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${redirect}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirect}`)
      } else {
        return NextResponse.redirect(`${origin}${redirect}`)
      }
    }
  }

  // Something went wrong with the OAuth exchange.
  return NextResponse.redirect(`${origin}/login?error=auth`)
}
