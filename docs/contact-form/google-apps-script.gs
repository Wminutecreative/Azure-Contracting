/**
 * Azure Contracting — contact form receiver (Google Apps Script, free).
 *
 * Every website enquiry is
 *   1. added as a new row to the "Enquiries" tab of the Google Sheet this script is attached to, and
 *   2. emailed to NOTIFY_EMAIL (reply goes straight to the person who filled in the form).
 *
 * Setup: see docs/contact-form.md. Paste this whole file into Extensions → Apps Script of your Google Sheet,
 * then Deploy → New deployment → Web app (Execute as: Me · Who has access: Anyone).
 */

// Where enquiry emails go. Add more addresses separated by commas, e.g. 'a@x.com, b@y.com'.
const NOTIFY_EMAIL = 'kartik@minutecreative.com, pavan@minutecreative.com, nazmoon@minutecreative.com';
const SHEET_NAME = 'Enquiries';
const HEADERS = ['Date', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Page'];

function doPost(e) {
  const p = (e && e.parameter) || {};

  // Spam trap: real visitors never see or fill this field
  if (p.company_website) return json({ ok: true });

  const name = clean(p.name, 120);
  const email = clean(p.email, 160);
  const phone = clean(p.phone, 40);
  const subject = clean(p.subject, 160);
  const message = clean(p.message, 5000);
  const page = clean(p.page, 300);

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) {
    return json({ ok: false, error: 'invalid' });
  }

  // 1. Google Sheet
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([new Date(), name, email, phone, subject, message, page].map(safeCell));
  } finally {
    lock.releaseLock();
  }

  // 2. Email notification
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: email,
    name: 'Azure Contracting website',
    subject: `New website enquiry${subject ? ': ' + subject : ''} — ${name}`,
    htmlBody: enquiryEmail({ name, email, phone, subject, message, page }),
    body:
      `New enquiry from the website\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || '—'}\n` +
      `Subject: ${subject || '—'}\n\nMessage:\n${message}\n\nSent from: ${page || '—'}`,
  });

  return json({ ok: true });
}

/**
 * Branded notification email (Azure Contracting site style): navy header with the azure wordmark, white card on
 * the pale site background, lime accents, details table, message panel and a "Reply" button.
 * Email-safe: table layout + inline styles only (works in Gmail, Outlook and Apple Mail).
 */
function enquiryEmail(d) {
  const NAVY = '#0E1F3D';
  const NEON = '#C7D92E';
  const BG = '#F4F9FD';
  const MUTED = '#5B6478';
  const LINE = '#E7E7E7';
  const font = "font-family:'DM Sans',Arial,Helvetica,sans-serif;";
  const firstName = d.name.split(/\s+/)[0];
  const received = Utilities.formatDate(new Date(), 'Europe/Dublin', "EEEE d MMMM yyyy 'at' HH:mm");

  const detail = (label, value, href) =>
    `<tr>` +
    `<td style="${font}padding:12px 0;border-bottom:1px solid ${LINE};width:110px;font-size:13px;color:${MUTED};vertical-align:top">${label}</td>` +
    `<td style="${font}padding:12px 0;border-bottom:1px solid ${LINE};font-size:15px;color:${NAVY};vertical-align:top">` +
    (href ? `<a href="${href}" style="color:${NAVY};text-decoration:underline">${esc(value)}</a>` : esc(value)) +
    `</td></tr>`;

  const mailtoReply =
    'mailto:' + encodeURIComponent(d.email) + '?subject=' + encodeURIComponent('Re: ' + (d.subject || 'Your enquiry to Azure Contracting'));

  return (
    `<!doctype html><html><body style="margin:0;padding:0;background:${BG}">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG}"><tr><td align="center" style="padding:32px 16px">` +
    `<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px">` +

    // Header: navy band with the wordmark and a lime rule
    `<tr><td style="background:${NAVY};border-radius:20px 20px 0 0;padding:28px 32px">` +
    `<table role="presentation" cellpadding="0" cellspacing="0"><tr>` +
    `<td style="width:26px;height:26px;border:3px solid ${NEON};border-radius:7px;font-size:0;line-height:0">&nbsp;</td>` +
    `<td style="${font}padding-left:10px;font-size:30px;line-height:1;color:#ffffff;font-weight:300;letter-spacing:-0.5px">azure</td>` +
    `</tr></table>` +
    `<div style="${font}margin-top:4px;padding-left:46px;font-size:9px;letter-spacing:1.5px;color:#ffffff;opacity:.75">FIT OUT SPECIALISTS</div>` +
    `</td></tr>` +
    `<tr><td style="background:${NEON};height:4px;font-size:0;line-height:0">&nbsp;</td></tr>` +

    // Body card
    `<tr><td style="background:#ffffff;padding:32px 32px 8px">` +
    `<div style="${font}display:inline-block;background:#F3F6D5;color:${NAVY};font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;padding:6px 12px;border-radius:999px">New website enquiry</div>` +
    `<h1 style="${font}margin:18px 0 6px;font-size:26px;line-height:1.25;font-weight:normal;color:${NAVY}">${esc(d.name)} would like to talk${d.subject ? ' about <span style="color:' + NAVY + ';font-weight:bold">' + esc(d.subject) + '</span>' : ''}</h1>` +
    `<p style="${font}margin:0 0 24px;font-size:13px;color:${MUTED}">Received ${received}</p>` +

    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${LINE}">` +
    detail('Name', d.name) +
    detail('Email', d.email, 'mailto:' + d.email) +
    (d.phone ? detail('Phone', d.phone, 'tel:' + d.phone.replace(/\s/g, '')) : '') +
    (d.subject ? detail('Subject', d.subject) : '') +
    `</table>` +

    `<p style="${font}margin:28px 0 8px;font-size:13px;color:${MUTED}">Message</p>` +
    `<div style="${font}white-space:pre-wrap;font-size:15px;line-height:1.6;color:#303030;background:${BG};border-left:4px solid ${NEON};border-radius:0 12px 12px 0;padding:18px 20px">${esc(d.message)}</div>` +

    // Reply button
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 32px"><tr>` +
    `<td style="background:${NAVY};border-radius:12px">` +
    `<a href="${mailtoReply}" style="${font}display:inline-block;padding:14px 22px;font-size:15px;color:#ffffff;text-decoration:none">Reply to ${esc(firstName)} &nbsp;<span style="color:${NEON}">&#9654;</span></a>` +
    `</td></tr></table>` +
    `</td></tr>` +

    // Footer
    `<tr><td style="background:#ffffff;border-top:1px solid ${LINE};border-radius:0 0 20px 20px;padding:18px 32px 24px">` +
    `<p style="${font}margin:0;font-size:12px;line-height:1.6;color:${MUTED}">` +
    `Sent from the contact form on ${d.page ? '<a href="' + esc(d.page) + '" style="color:' + MUTED + '">' + esc(d.page.replace(/^https?:\/\//, '').replace(/\/$/, '')) + '</a>' : 'the website'}.<br>` +
    `Pressing Reply in your email app answers ${esc(firstName)} directly. A copy is saved in the Enquiries sheet.</p>` +
    `</td></tr>` +

    `</table></td></tr></table></body></html>`
  );
}

// Opening the web-app URL in a browser just confirms it is live
function doGet() {
  return json({ ok: true, service: 'Azure Contracting contact form' });
}

function clean(v, max) {
  return String(v || '').trim().slice(0, max);
}
// Stop values like "=HYPERLINK(...)" being treated as spreadsheet formulas
function safeCell(v) {
  return typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v;
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
