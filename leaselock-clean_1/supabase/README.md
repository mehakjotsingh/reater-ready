# Supabase database migrations

Schema changes live in **`migrations/`** and are applied automatically on push to `main` via GitHub Actions (once secrets are configured).

## Automated deploy (production)

On every push to `main` that changes `supabase/migrations/**`, the workflow [`.github/workflows/supabase-migrations.yml`](../../.github/workflows/supabase-migrations.yml) runs:

```bash
supabase link --project-ref <project>
supabase db push
```

### One-time: add GitHub secrets

In the repo → **Settings → Secrets and variables → Actions**, add:

| Secret | Where to get it |
|--------|-----------------|
| `SUPABASE_ACCESS_TOKEN` | [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens) → Generate new token |
| `SUPABASE_PROJECT_REF` | Project Settings → General → **Reference ID** (`hvondhskwmdiufjikmzd`) |
| `SUPABASE_DB_PASSWORD` | The database password you set when creating the Supabase project |

After secrets are set, push a migration file (or re-run the workflow from the **Actions** tab).

## Local: push migrations yourself

```bash
cd leaselock-clean_1
npx supabase login
npx supabase link --project-ref hvondhskwmdiufjikmzd
npm run db:push
```

## Adding a new migration

```bash
cd leaselock-clean_1
npx supabase migration new describe_your_change
# Edit the new file under supabase/migrations/
npm run db:push    # test locally against remote
git add supabase/migrations/
git commit -m "Add migration: describe_your_change"
git push origin main   # CI applies it automatically
```

## Already ran SQL manually?

If your database already has the schema from the old hand-pasted SQL files, either:

**Option A — let CI run once (recommended)**  
Migrations are idempotent (`IF NOT EXISTS`, `CREATE OR REPLACE`). The first automated run should no-op safely and record versions in `supabase_migrations.schema_migrations`.

**Option B — mark migrations as already applied**  
```bash
npx supabase login
npx supabase link --project-ref hvondhskwmdiufjikmzd
npx supabase migration repair --status applied 20250628120000
npx supabase migration repair --status applied 20250628120001
```

## Legacy manual SQL files

The loose files (`schema.sql`, `02_shared_lease.sql`, etc.) are **deprecated**. Use `migrations/` instead. They are kept for reference only.
