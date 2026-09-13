const crypto = require('node:crypto');
const { config, getBody, requireAdmin, fail } = require('./_supabase');

const types = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method not allowed' });
    }
    requireAdmin(req);
    const { url, key } = config();
    const body = getBody(req);
    const type = String(body.type || '');
    const ext = types[type];
    if (!ext) return res.status(400).json({ error: 'Please upload a JPG, PNG, or WebP image.' });
    const data = String(body.data || '');
    if (!data) return res.status(400).json({ error: 'Image data is required.' });
    const buffer = Buffer.from(data, 'base64');
    if (!buffer.length || buffer.length > 8 * 1024 * 1024) return res.status(400).json({ error: 'Image must be 8 MB or smaller.' });

    const objectName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
    const response = await fetch(`${url}/storage/v1/object/puppy-images/${objectName}`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': type,
        'x-upsert': 'false',
      },
      body: buffer,
    });
    const text = await response.text();
    if (!response.ok) {
      let detail = text;
      try { detail = JSON.parse(text).message || text; } catch {}
      const err = new Error(`Image upload failed: ${detail}`);
      err.statusCode = response.status;
      throw err;
    }
    return res.status(201).json({ url: `${url}/storage/v1/object/public/puppy-images/${objectName}` });
  } catch (error) {
    return fail(res, error);
  }
};
