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
const NOTIFY_EMAIL = 'kartik@minutecreative.com';
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
  const rows = [
    ['Name', name],
    ['Email', email],
    ['Phone', phone || '—'],
    ['Subject', subject || '—'],
    ['Page', page || '—'],
  ]
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#585858">${k}</td><td style="padding:4px 0">${esc(v)}</td></tr>`)
    .join('');
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: email,
    name: 'Azure Contracting website',
    subject: `New website enquiry${subject ? ': ' + subject : ''} — ${name}`,
    htmlBody:
      `<div style="font-family:Arial,sans-serif;font-size:14px;color:#0E1F3D">` +
      `<h2 style="margin:0 0 12px">New enquiry from the website</h2>` +
      `<table style="border-collapse:collapse">${rows}</table>` +
      `<p style="margin:16px 0 4px;color:#585858">Message</p>` +
      `<div style="white-space:pre-wrap;padding:12px;background:#F4F9FD;border-radius:8px">${esc(message)}</div>` +
      `<p style="margin-top:16px;color:#585858;font-size:12px">Reply to this email to answer ${esc(name)} directly.</p>` +
      `</div>`,
  });

  return json({ ok: true });
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
