const INBOX = process.env.FORM_INBOX || 'applications@easttnchihuahuas.com';
const FROM = process.env.FORM_FROM_EMAIL || 'East Tennessee Chihuahuas <applications@easttnchihuahuas.com>';

const LABELS = {
  application: 'Puppy Application',
  'deposit-agreement': 'Deposit & Reservation Agreement',
  'bill-of-sale': 'Puppy Sales Agreement & Bill of Sale',
  'health-guarantee': '1-Year Health Guarantee',
  'financing-addendum': 'Financing Addendum',
  'lifetime-return': 'Lifetime Return & Rehoming Policy',
  'transportation-policy': 'Transportation Policy',
  'buyer-care-agreement': 'Buyer Care Agreement',
  'small-puppy-policy': 'Small Puppy Safety Policy',
  'breeding-rights-policy': 'Breeding Rights Policy'
};

function esc(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalizeBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body); } catch { return {}; }
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function confirmationText(type, label, name) {
  const first = String(name || '').trim().split(/\s+/)[0] || 'there';
  if (type === 'application') {
    return {
      subject: 'We received your East Tennessee Chihuahuas application',
      heading: 'Thank you for submitting your application.',
      body: `Hi ${first}, we received your puppy application and sent a copy to our applications inbox. We will review the information you provided and follow up using the contact information on your application.`
    };
  }
  if (type === 'deposit-agreement') {
    return {
      subject: 'We received your Deposit & Reservation Agreement',
      heading: 'Thank you for submitting your deposit agreement.',
      body: `Hi ${first}, we received your completed Deposit & Reservation Agreement and sent a copy to our applications inbox. If your deposit payment is being made separately, we will match the payment to your agreement when it is received.`
    };
  }
  return {
    subject: `We received your ${label}`,
    heading: `Thank you for submitting your ${label}.`,
    body: `Hi ${first}, we received your completed ${label} and sent a copy to our applications inbox. Please keep this email for your records.`
  };
}

async function sendEmail(payload) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    const error = new Error('Email delivery is not configured yet.');
    error.statusCode = 503;
    throw error;
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!response.ok) {
    const error = new Error(data?.message || `Email delivery failed (${response.status}).`);
    error.statusCode = response.status;
    throw error;
  }
  return data;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = normalizeBody(req);
    const type = String(body.type || '').trim();
    const label = LABELS[type] || String(body.label || 'Website Form').trim();
    const customerName = String(body.customerName || body.name || '').trim();
    const customerEmail = String(body.customerEmail || body.email || '').trim().toLowerCase();
    const pageUrl = String(body.pageUrl || '').trim();
    const submitted = body.fields && typeof body.fields === 'object' ? body.fields : {};

    if (!LABELS[type]) return res.status(400).json({ error: 'Unknown form type.' });
    if (!customerName) return res.status(400).json({ error: 'Customer name is required.' });
    if (!isEmail(customerEmail)) return res.status(400).json({ error: 'A valid customer email address is required.' });

    const entries = Object.entries(submitted)
      .filter(([, value]) => value !== '' && value !== null && value !== undefined)
      .slice(0, 200);

    const rows = entries.length
      ? entries.map(([key, value]) => `<tr><th style="text-align:left;padding:8px;border-bottom:1px solid #e5e7eb;vertical-align:top">${esc(key)}</th><td style="padding:8px;border-bottom:1px solid #e5e7eb">${esc(Array.isArray(value) ? value.join(', ') : value)}</td></tr>`).join('')
      : '<tr><td style="padding:8px">No additional fields were supplied.</td></tr>';

    const receivedAt = new Date().toISOString();
    const adminSubject = `${label} submitted - ${customerName}`;
    const adminHtml = `
      <div style="font-family:Arial,sans-serif;max-width:760px;margin:auto;color:#142b3c">
        <h1 style="font-size:22px">${esc(label)} submitted</h1>
        <p><strong>Customer:</strong> ${esc(customerName)}<br><strong>Email:</strong> ${esc(customerEmail)}<br><strong>Received:</strong> ${esc(receivedAt)}</p>
        <table style="border-collapse:collapse;width:100%">${rows}</table>
        ${pageUrl ? `<p style="margin-top:20px;font-size:12px;color:#64748b">Submitted from ${esc(pageUrl)}</p>` : ''}
      </div>`;

    const confirmation = confirmationText(type, label, customerName);
    const customerHtml = `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#142b3c">
        <h1 style="font-size:22px">${esc(confirmation.heading)}</h1>
        <p>${esc(confirmation.body)}</p>
        <p><strong>Document:</strong> ${esc(label)}<br><strong>Submitted:</strong> ${esc(receivedAt)}</p>
        <p>If you need to add information, reply to this email or contact <a href="mailto:${esc(INBOX)}">${esc(INBOX)}</a>.</p>
        <p style="margin-top:28px">East Tennessee Chihuahuas<br>Johnson City, Tennessee</p>
      </div>`;

    await sendEmail({
      from: FROM,
      to: [INBOX],
      reply_to: customerEmail,
      subject: adminSubject,
      html: adminHtml
    });

    await sendEmail({
      from: FROM,
      to: [customerEmail],
      reply_to: INBOX,
      subject: confirmation.subject,
      html: customerHtml
    });

    return res.status(200).json({ ok: true, deliveredTo: INBOX, confirmationSentTo: customerEmail });
  } catch (error) {
    const status = Number(error?.statusCode) || 500;
    return res.status(status).json({ error: error?.message || 'Unable to submit the form.' });
  }
};
