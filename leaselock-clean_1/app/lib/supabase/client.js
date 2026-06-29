import { createBrowserClient } from '@supabase/ssr'

let browserClient

// Singleton browser-side Supabase client. Safe to import from any client component.
export function createClient() {
  if (browserClient) return browserClient
  browserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  return browserClient
}
