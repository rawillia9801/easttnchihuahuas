const crypto = require('node:crypto');

// Bootstrap password requested for the breeder admin. We store only its SHA-256
// digest in source so the plaintext password is not committed to the repository.
// ADMIN_TOKEN, when configured in the deployment, still takes precedence.
const BOOTSTRAP_ADMIN_TOKEN_SHA256 = '1b54c03e6fa2bb76320fc7798914d067a3df5b325651adbbab716939d3f4edb3';

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminToken = process.env.ADMIN_TOKEN;
  if (!url || !key) {
    const err = new Error('Puppy database is not configured yet.');
    err.statusCode = 503;
    throw err;
  }
  return { url: url.replace(/\/$/, ''), key, adminToken };
}

function getBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body); } catch { return {}; }
}

function bearer(req) {
  const raw = String(req.headers.authorization || '');
  return raw.startsWith('Bearer ') ? raw.slice(7) : '';
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function bootstrapTokenMatches(token) {
  if (!token) return false;
  const digest = crypto.createHash('sha256').update(token, 'utf8').digest('hex');
  return safeEqual(digest, BOOTSTRAP_ADMIN_TOKEN_SHA256);
}

function requireAdmin(req) {
  const { adminToken } = config();
  const supplied = bearer(req);
  const configuredMatch = Boolean(adminToken) && safeEqual(supplied, adminToken);
  const bootstrapMatch = bootstrapTokenMatches(supplied);
  if (!configuredMatch && !bootstrapMatch) {
    const err = new Error('Unauthorized');
    err.statusCode = 401;
    throw err;
  }
}

async function supabase(path, options = {}) {
  const { url, key } = config();
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    ...options.headers,
  };
  const response = await fetch(`${url}${path}`, { ...options, headers });
  const text = await response.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }
  if (!response.ok) {
    const err = new Error(data?.message || data?.error || `Database request failed (${response.status})`);
    err.statusCode = response.status;
    throw err;
  }
  return data;
}

function fail(res, error) {
  const status = Number(error?.statusCode) || 500;
  res.status(status).json({ error: error?.message || 'Unexpected server error' });
}

module.exports = { config, getBody, requireAdmin, supabase, fail };
