import { Request, Response, NextFunction } from 'express';

export type Role = 'admin' | 'abogado';

// Extend Express' Request so `req.user` is typed everywhere.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { email: string; role: Role };
    }
  }
}

// Staff email lives on Google Workspace across these three domains. The Google
// `hd` hint only restricts a single domain, so the real access boundary is here.
const DEFAULT_DOMAINS = ['kollect.com.co', 'legalcollection.co', 'legalforcegroup.com'];

function parseList(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

const ALLOWED_DOMAINS = new Set(
  parseList(process.env.AUTH_ALLOWED_DOMAINS).length
    ? parseList(process.env.AUTH_ALLOWED_DOMAINS)
    : DEFAULT_DOMAINS,
);

const ADMIN_EMAILS = new Set(parseList(process.env.AUTH_ADMIN_EMAILS));

// Individually approved emails outside the allowed domains (e.g. an external
// developer or auditor). Lets a specific address in WITHOUT opening its whole
// domain — so `dev@gmail.com` can be admitted while all other @gmail.com stays out.
const ALLOWED_EMAILS = new Set(parseList(process.env.AUTH_ALLOWED_EMAILS));

function domainOf(email: string): string {
  return email.split('@')[1]?.toLowerCase() ?? '';
}

function isAllowed(email: string): boolean {
  return ALLOWED_DOMAINS.has(domainOf(email)) || ALLOWED_EMAILS.has(email.toLowerCase());
}

export function roleForEmail(email: string): Role {
  return ADMIN_EMAILS.has(email.toLowerCase()) ? 'admin' : 'abogado';
}

/**
 * Extract the authenticated user's email from Easy Auth headers.
 * Prefers the plain principal-name header; falls back to decoding the full
 * base64 principal and matching common email claim types. Returns null if the
 * headers are present but no email can be extracted.
 */
function extractEmail(nameHeader?: string, principalB64?: string): string | null {
  if (nameHeader) return nameHeader.toLowerCase();
  if (!principalB64) return null;
  try {
    const decoded = JSON.parse(Buffer.from(principalB64, 'base64').toString('utf8'));
    const claims: Array<{ typ: string; val: string }> = decoded.claims ?? [];
    const claim = claims.find(
      (c) =>
        c.typ === 'emails' ||
        c.typ === 'email' ||
        c.typ === 'preferred_username' ||
        c.typ.endsWith('/emailaddress'),
    );
    if (claim?.val) return claim.val.toLowerCase();
    // Fail closed, but leave a breadcrumb (claim TYPES only — never values) so a
    // claim-shape mismatch is diagnosable from the logs without leaking PII.
    console.warn(
      '[auth] authenticated principal but no email claim matched; claim types:',
      claims.map((c) => c.typ),
    );
    return null;
  } catch {
    return null;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  // Dev bypass for local `npm run dev`. Gated on the ABSENCE of WEBSITE_SITE_NAME,
  // which App Service always injects — so this is physically inert on Azure even
  // if AUTH_DEV_BYPASS somehow leaks into the production environment.
  if (process.env.AUTH_DEV_BYPASS === 'true' && !process.env.WEBSITE_SITE_NAME) {
    const email = (process.env.AUTH_DEV_EMAIL || 'dev@kollect.com.co').toLowerCase();
    req.user = { email, role: roleForEmail(email) };
    return next();
  }

  const nameHeader = req.header('X-MS-CLIENT-PRINCIPAL-NAME');
  const principalB64 = req.header('X-MS-CLIENT-PRINCIPAL');

  // No Easy Auth headers at all → genuinely not signed in. This is the ONLY 401
  // path; the client redirects to Google login on 401. A parse/domain failure
  // below must NOT 401, or an authenticated-but-rejected user would loop:
  // 401 → login → instant Google round-trip → same headers → 401 → …
  if (!nameHeader && !principalB64) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  // Headers present → the user IS authenticated by Google. Everything from here
  // fails CLOSED with 403 (no redirect).
  const email = extractEmail(nameHeader, principalB64);
  if (!email) {
    res.status(403).json({ error: 'No se pudo determinar el usuario autenticado' });
    return;
  }
  if (!isAllowed(email)) {
    res.status(403).json({ error: 'Dominio no autorizado' });
    return;
  }

  req.user = { email, role: roleForEmail(email) };
  next();
}
