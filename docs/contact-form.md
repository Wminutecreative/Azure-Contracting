# Contact form → Google Sheet + email (free)

The form on `/contact` sends each enquiry to a small **Google Apps Script** attached to a Google Sheet. The script:

1. adds a row to the sheet (Date · Name · Email · Phone · Subject · Message · Page), and
2. emails the enquiry to **kartik@minutecreative.com** — just hit Reply to answer the customer.

Free on any Google account (limit: 100 notification emails per day). No third-party service.

## One-time setup (~5 minutes)

1. **Create the sheet** — go to <https://sheets.new> and name it e.g. *Azure Contracting — Website enquiries*.
2. **Add the script** — in the sheet: **Extensions → Apps Script**. Delete the sample code, paste the whole of
   [`contact-form/google-apps-script.gs`](contact-form/google-apps-script.gs), and click **Save**.
   (To change or add recipients, edit `NOTIFY_EMAIL` at the top.)
3. **Deploy** — **Deploy → New deployment** → gear icon → **Web app**:
   - Description: `Website contact form`
   - Execute as: **Me**
   - Who has access: **Anyone**
   
   Click **Deploy**, then **Authorize access** and allow it (Google shows an "unverified app" warning because
   it's your own script: **Advanced → Go to … (unsafe) → Allow**).
4. **Copy the Web app URL** (ends in `/exec`).
5. **Connect the website**
   - Local: add to `.env` → `PUBLIC_FORM_ENDPOINT=https://script.google.com/macros/s/…/exec`
   - Vercel: **Settings → Environment Variables** → `PUBLIC_FORM_ENDPOINT` (Production + Preview) → redeploy.
6. **Test** — submit the form on the site: a row appears in the sheet's **Enquiries** tab and the email arrives.

## Changing the script later

Edit the code, then **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. The URL stays the
same, so nothing changes on the website.

## Spam & tracking

- A hidden "honeypot" field silently drops most bot submissions.
- A successful send pushes `generate_lead` to the GTM `dataLayer` (for Google Analytics conversion tracking).
