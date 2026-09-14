const { sendFromMailbox } = require('./_mail');

const APPLICATIONS_INBOX = process.env.APPLICATIONS_INBOX || 'applications@easttnchihuahuas.com';
const CONTACT_INBOX = process.env.CONTACT_INBOX || 'contact@easttnchihuahuas.com';
const SUPPORT_INBOX = process.env.SUPPORT_INBOX || 'support@easttnchihuahuas.com';

const LABELS = {
  application: 'Puppy Application',
  'application-inquiry': 'Application Question',
  contact: 'Website Inquiry',
  support: 'Buyer & Family Support Request',
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

const APPLICATION_TYPES = new Set([
  'application',
  'application-inquiry',
  'deposit-agreement',
  'bill-of-sale',
  'health-guarantee',
  'financing-addendum',
  'lifetime-return',
  'transportation-policy',
  'buyer-care-agreement',
  'small-puppy-policy',
  'breeding-rights-policy'
]);

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

function routeFor(type) {
  if (type === 'contact') {
    return {
      inbox: CONTACT_INBOX,
      credential: process.env.CONTACT_MAIL_PASSWORD || process.env.HOSTINGER_MAIL_PASSWORD || ''
    };
  }
  if (type === 'support') {
    return {
      inbox: SUPPORT_INBOX,
      credential: process.env.SUPPORT_MAIL_PASSWORD || process.env.HOSTINGER_MAIL_PASSWORD || ''
    };
  }
  if (APPLICATION_TYPES.has(type)) {
    return {
      inbox: APPLICATIONS_INBOX,
      credential: process.env.APPLICATIONS_MAIL_PASSWORD || process.env.HOSTINGER_MAIL_PASSWORD || ''
    };
  }
  return null;
}

function confirmationText(type, label, name) {
  const first = String(name || '').trim().split(/\s+/)[0] || 'there';
  if (type === 'application') {
    return {
      subject: 'We received your East Tennessee Chihuahuas application',
      heading: 'Thank you for submitting your application.',
      body: `Hi ${first}, we received your puppy application. It has been delivered to our applications inbox for review. We will follow up using the contact information on your application.`
    };
  }
  if (type === 'application-inquiry') {
    return {
      subject: 'We received your application question — East Tennessee Chihuahuas',
      heading: 'Thank you for your application question.',
      body: `Hi ${first}, your message has been delivered to our applications inbox. We will review your question and follow up with you.`
    };
  }
  if (type === 'contact') {
    return {
      subject: 'We received your message — East Tennessee Chihuahuas',
      heading: 'Thank you for contacting East Tennessee Chihuahuas.',
      body: `Hi ${first}, your message has been delivered to our contact inbox. We will review it and reply as soon as we can.`
    };
  }
  if (type === 'support') {
    return {
      subject: 'We received your support request — East Tennessee Chihuahuas',
      heading: 'Your support request has been received.',
      body: `Hi ${first}, your message has been delivered to our support inbox. We will review the details you provided and follow up with you.`
    };
  }
  if (type === 'deposit-agreement') {
    return {
      subject: 'We received your Deposit & Reservation Agreement',
      heading: 'Thank you for submitting your deposit agreement.',
      body: `Hi ${first}, we received your completed Deposit & Reservation Agreement and delivered it to our applications inbox. If your deposit payment is being made separately, we will match the payment to your agreement when it is received.`
    };
  }
  return {
    subject: `We received your ${label}`,
    heading: `Thank you for submitting your ${label}.`,
    body: `Hi ${first}, we received your completed ${label} and delivered it to our applications inbox. Please keep this email for your records.`
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = normalizeBody(req);
    const type = String(body.type || '').trim();
    const label = LABELS[type];
    const route = routeFor(type);
    const customerName = String(body.customerName || body.name || '').trim().slice(0, 160);
    const customerEmail = String(body.customerEmail || body.email || '').trim().toLowerCase().slice(0, 254);
    const pageUrl = String(body.pageUrl || '').trim().slice(0, 1000);
    const submitted = body.fields && typeof body.fields === 'object' ? body.fields : {};
    const honeypot = String(body.website || submitted.website || '').trim();

    if (honeypot) return res.status(200).json({ ok: true });
    if (!label || !route) return res.status(400).json({ error: 'Unknown form type.' });
    if (!customerName) return res.status(400).json({ error: 'Customer name is required.' });
    if (!isEmail(customerEmail)) return res.status(400).json({ error: 'A valid customer email address is required.' });

    const entries = Object.entries(submitted)
      .filter(([key, value]) => key !== 'website' && value !== '' && value !== null && value !== undefined)
      .slice(0, 250);

    const rows = entries.length
      ? entries.map(([key, value]) => {
          const normalized = Array.isArray(value) ? value.join(', ') : String(value);
          return `<tr><th style="text-align:left;padding:8px;border-bottom:1px solid #e5e7eb;vertical-align:top;width:35%">${esc(String(key).slice(0, 160))}</th><td style="padding:8px;border-bottom:1px solid #e5e7eb">${esc(normalized.slice(0, 7000))}</td></tr>`;
        }).join('')
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
        <p><strong>Submission:</strong> ${esc(label)}<br><strong>Received:</strong> ${esc(receivedAt)}</p>
        <p>If you need to add information, reply to this email or contact <a href="mailto:${esc(route.inbox)}">${esc(route.inbox)}</a>.</p>
        <p style="margin-top:28px">East Tennessee Chihuahuas<br>Johnson City, Tennessee</p>
      </div>`;

    await sendFromMailbox({
      address: route.inbox,
      credential: route.credential,
      to: route.inbox,
      replyTo: customerEmail,
      subject: adminSubject,
      html: adminHtml
    });

    await sendFromMailbox({
      address: route.inbox,
      credential: route.credential,
      to: customerEmail,
      replyTo: route.inbox,
      subject: confirmation.subject,
      html: customerHtml
    });

    return res.status(200).json({
      ok: true,
      deliveredTo: route.inbox,
      confirmationSentTo: customerEmail,
      transport: 'hostinger-smtp'
    });
  } catch (error) {
    const status = Number(error?.statusCode) || 500;
    return res.status(status).json({ error: error?.message || 'Unable to submit the form.' });
  }
};
