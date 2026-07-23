# Authentication setup

Kollect uses **Azure App Service "Easy Auth"** with **Google** as the identity provider.
Azure gates the entire site at the platform edge — an unauthenticated visitor is redirected to
Google before the app loads. Once signed in, the app's own middleware
(`server/src/auth.ts`) enforces that the user's email is on an **allowed domain**:

- `kollect.com.co`
- `legalcollection.co`
- `legalforcegroup.com`

All three are Google Workspace domains. Any authenticated user on these domains gets full access;
role (`admin` / `abogado`) is derived from the email but does **not** restrict routes today.

> Google's built-in single-domain restriction (`hd`) can't cover three domains, so the
> allowlist in `server/src/auth.ts` is the real access boundary — not Google's login screen.

---

## 1. Google Cloud Console — create an OAuth client

1. Go to <https://console.cloud.google.com/> and pick (or create) a project.
2. **APIs & Services → OAuth consent screen**:
   - **User type: `External`**, then **Publish** the app (Publishing status → *In production*).
   - **This matters:** if you use `Internal`, Google will only admit accounts from the *one*
     Workspace tenant that owns the project and will block the other two domains at its own login
     screen — before our allowlist ever runs. `External` + basic scopes admits any Google account;
     our server-side allowlist is what actually restricts access.
   - Scopes: only the basics — `openid`, `email`, `profile`. (These need **no** Google verification
     review, so publishing is instant.)
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Application type: **Web application**.
   - **Authorized redirect URI:**
     `https://kollect-col.azurewebsites.net/.auth/login/google/callback`
   - Save the **Client ID** and **Client secret**.

---

## 2. Azure Portal — enable Easy Auth

1. Portal → App Service **`kollect-col`** → **Settings → Authentication**.
2. **Add identity provider** → **Google**.
   - Paste the **Client ID** and **Client secret** from step 1.
3. Set **"Restrict access" → Require authentication**.
   - Unauthenticated requests → **HTTP 302** redirect to Google login.
4. Save. Easy Auth now provides these endpoints automatically:
   - `/.auth/login/google` — sign in
   - `/.auth/logout` — sign out (used by the "Salir" button)
   - `/.auth/me` — raw principal (the app uses its own `/api/me` instead)

---

## 3. Azure App Settings

App Service → **Settings → Environment variables**:

| Setting | Value | Notes |
|---|---|---|
| `AUTH_ADMIN_EMAILS` | *(optional)* `you@kollect.com.co,other@…` | Emails that get the `admin` role. Omit → everyone is `abogado`. |
| `AUTH_ALLOWED_DOMAINS` | *(optional)* | Overrides the three baked-in domains. Leave unset to use defaults. |
| `AUTH_DEV_BYPASS` | **do not set** | Local-dev only. It is inert on Azure (gated on `WEBSITE_SITE_NAME`), but never add it here. |

---

## Local development

Azure Easy Auth only exists on Azure, so locally we bypass it. `server/.env` ships with:

```
AUTH_DEV_BYPASS=true
AUTH_DEV_EMAIL=dev@kollect.com.co
```

With the bypass on, `npm run dev` signs you in as `AUTH_DEV_EMAIL` (must be an allowed domain) and
everything works without Azure. The bypass is gated on the **absence** of `WEBSITE_SITE_NAME` (which
App Service always sets), so it can never activate in production.

To exercise the real code path locally, unset `AUTH_DEV_BYPASS` and send headers manually:

```bash
# No headers → 401 (client would redirect to Google login)
curl -i localhost:3001/api/me

# Authenticated but wrong domain → 403
curl -s -H 'X-MS-CLIENT-PRINCIPAL-NAME: someone@gmail.com' localhost:3001/api/me

# Authenticated + allowed domain → 200 {"email":"...","role":"abogado"}
curl -s -H 'X-MS-CLIENT-PRINCIPAL-NAME: someone@kollect.com.co' localhost:3001/api/me
```

---

## How it behaves

| Situation | Result |
|---|---|
| Not signed in | Azure redirects to Google (prod); client redirects on any `401` |
| Signed in, allowed domain | Full access; header shows email + "Salir" |
| Signed in, other domain (e.g. personal `@gmail.com`) | `403` → "Acceso no autorizado" screen |
| "Salir" clicked | Logs out via `/.auth/logout` |

## Confirm on first deploy: session-expiry behavior

With **"Require authentication"** set, Easy Auth intercepts unauthenticated requests *before* they
reach Node and returns a **302** to Google — not a 401. On initial page load this is exactly right
(browser redirects, user logs in, SPA loads). But when a session **expires mid-use**, an in-flight
`fetch('/api/me')` receives that 302, follows it cross-origin to Google, and the browser's CORS
policy blocks reading the response — so the promise rejects with a generic network error (not a 401
or 403). The client is written to treat that as a *transient* failure (it does **not** show the
"Acceso no autorizado" screen — that's reserved for a real `403`). After first deploy, expire a
session (or wait it out) and confirm the desired UX; if a hard re-login prompt is wanted at that
moment, the simplest fix is a full-page reload on repeated API failure, which re-triggers the 302 at
the document level. The `401` → `/.auth/login/google` redirect in `api.ts` is a safety net for the
"reached Node with no auth" case and normally won't fire while Easy Auth is enforcing.

## Adding / removing an allowed domain

Edit `DEFAULT_DOMAINS` in `server/src/auth.ts` (or set `AUTH_ALLOWED_DOMAINS` in Azure App Settings),
then redeploy. No database change is involved — identity comes from Google, not a local users table.
