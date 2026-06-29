# Supabase auth + database setup

This app uses **Supabase** for Google login and per-user / shared-lease data.
Database schema is managed by **Supabase CLI migrations** (automated on push to `main`).

## 1. Create a Supabase project
1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Pick a name, database password, and region. Wait for it to finish provisioning.
3. Save the **database password** — you need it for automated migrations.

## 2. Apply database migrations

### Automated (recommended)

Add these **GitHub Actions secrets** (repo → Settings → Secrets → Actions):

| Secret | Value |
|--------|--------|
| `SUPABASE_ACCESS_TOKEN` | [Account tokens](https://supabase.com/dashboard/account/tokens) |
| `SUPABASE_PROJECT_REF` | Your project reference ID (e.g. `hvondhskwmdiufjikmzd`) |
| `SUPABASE_DB_PASSWORD` | Database password from step 1 |

Push to `main` (or run the **Supabase migrations** workflow manually). Migrations in
[`supabase/migrations/`](./supabase/migrations/) are applied automatically.

See [`supabase/README.md`](./supabase/README.md) for local CLI usage and adding new migrations.

### Manual (fallback)

```bash
cd leaselock-clean_1
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npm run db:push
```

## 3. Set up Google login
You need a Google OAuth client, then connect it to Supabase.

**a) Google Cloud Console**
1. Go to [console.cloud.google.com](https://console.cloud.google.com) → create/select a project.
2. **APIs & Services → OAuth consent screen** → configure (External, add your email as a test user).
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**.
   - Application type: **Web application**.
   - **Authorized redirect URIs**: add your Supabase callback URL:
     ```
     https://YOUR-PROJECT-ref.supabase.co/auth/v1/callback
     ```
4. Copy the **Client ID** and **Client secret**.

**b) Supabase dashboard**
1. **Authentication → Providers → Google** → enable it.
2. Paste the Google **Client ID** and **Client secret** → Save.
3. **Authentication → URL Configuration**:
   - **Site URL**: `http://localhost:3000` (and your production URL when deployed).
   - **Redirect URLs**: add `http://localhost:3000/**` and `https://your-domain.com/**`.

## 4. Add environment variables
1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```
2. Fill in from **Supabase → Project Settings → API**:
   - `NEXT_PUBLIC_SUPABASE_URL` → Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → publishable / anon public key
3. Keep your existing `ANTHROPIC_API_KEY` (and `GEOAPIFY_API_KEY` if used).

## 5. Run it
```bash
npm install
npm run dev
```
- Visit `http://localhost:3000` → **Log in** (or open `/app`, which redirects to `/login`).
- Sign in with Google.

## Notes
- `/app` and `/report` require login (`middleware.js`).
- Marketing pages (`/`, `/guides`, `/tools/*`) stay public.
- Shared lease data (calendar, maintenance, rent, agreement, lease review) is scoped per **household** via RLS.
