const nodemailer = require('nodemailer');

const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
const port = Number(process.env.SMTP_PORT || 465);
const secure = String(process.env.SMTP_SECURE || 'true').toLowerCase() !== 'false';

function createMailer(address, credential) {
  if (!address || !credential) {
    const error = new Error('Mail credentials are not configured.');
    error.statusCode = 503;
    throw error;
  }
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user: address, pass: credential },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
  });
}

async function sendFromMailbox({ address, credential, to, replyTo, subject, html }) {
  const mailer = createMailer(address, credential);
  return mailer.sendMail({
    from: `East Tennessee Chihuahuas <${address}>`,
    to,
    replyTo,
    subject,
    html
  });
}

module.exports = { sendFromMailbox };
