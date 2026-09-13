const { getBody, requireAdmin, supabase, fail } = require('./_supabase');

const allowed = [
  'name','status','sex','birth_date','price','ready_date','registry','coat','color',
  'size_category','sire','dam','description','image_url'
];

function clean(input) {
  const out = {};
  for (const key of allowed) if (Object.prototype.hasOwnProperty.call(input, key)) out[key] = input[key] === '' ? null : input[key];
  if (!out.status) out.status = 'available';
  return out;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method === 'GET') {
      const admin = String(req.query?.admin || '') === '1';
      if (admin) requireAdmin(req);
      const status = admin ? null : String(req.query?.status || 'available');
      let query = '/rest/v1/puppies?select=*&order=created_at.desc';
      if (status) query += `&status=eq.${encodeURIComponent(status)}`;
      const rows = await supabase(query, { method: 'GET' });
      return res.status(200).json(rows || []);
    }

    if (req.method === 'POST') {
      requireAdmin(req);
      const body = clean(getBody(req));
      if (!body.name) return res.status(400).json({ error: 'Puppy name is required.' });
      const rows = await supabase('/rest/v1/puppies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
        body: JSON.stringify(body),
      });
      return res.status(201).json(Array.isArray(rows) ? rows[0] : rows);
    }

    if (req.method === 'PUT') {
      requireAdmin(req);
      const id = String(req.query?.id || '');
      if (!id) return res.status(400).json({ error: 'Puppy id is required.' });
      const body = clean(getBody(req));
      const rows = await supabase(`/rest/v1/puppies?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
        body: JSON.stringify({ ...body, updated_at: new Date().toISOString() }),
      });
      return res.status(200).json(Array.isArray(rows) ? rows[0] : rows);
    }

    if (req.method === 'DELETE') {
      requireAdmin(req);
      const id = String(req.query?.id || '');
      if (!id) return res.status(400).json({ error: 'Puppy id is required.' });
      await supabase(`/rest/v1/puppies?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Prefer: 'return=minimal' },
      });
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET,POST,PUT,DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return fail(res, error);
  }
};
