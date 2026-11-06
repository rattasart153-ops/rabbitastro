# Rabbitastro Booking System — Setup

## Architecture
- Public website submits booking requests to the same-origin Vercel endpoint `/api/booking`.
- Vercel serverless functions proxy requests to Google Apps Script. The Apps Script URL is stored only in the Vercel environment variable `GAS_WEB_APP_URL`; it is not embedded in browser code.
- Google Apps Script stores bookings in a private-by-default Google Sheet owned by the connected Google account. Script Properties hold the spreadsheet ID, admin username, password salt/hash and short-lived admin sessions.
- Admin UI: `/admin`. Admin session token is kept in tab-scoped `sessionStorage`, not in the URL or Local Storage.

## Google Apps Script setup
1. Sign in with the existing Google account and open https://script.google.com/home.
2. Create a standalone Apps Script project named Rabbitastro Booking API.
3. Paste `google-apps-script/Code.gs` into `Code.gs`.
4. In Project Settings → Script Properties, add:
   - `INITIAL_ADMIN_USERNAME`: the admin login name you choose.
   - `INITIAL_ADMIN_PASSWORD`: a unique password of at least 12 characters.
5. Run `initializeAdminCredentials` once and approve the Google permissions. It stores a salted SHA-256 hash and removes the initial plaintext properties.
6. Run `initializeBookingSheet` once and approve permissions. The script creates a Google Sheet and stores its ID in Script Properties. Keep the resulting Sheet private; do not publish it or enable public link access.
7. Deploy → New deployment → Web app:
   - Execute as: Me
   - Who has access: Anyone
   Copy the Web app URL ending in `/exec`.
8. In Vercel Project → Settings → Environment Variables, add `GAS_WEB_APP_URL` with that URL for Production and Preview, then redeploy.

The public web app endpoint accepts booking submissions only; admin operations require a username/password login and an expiring server-side token. Do not put the admin password or Sheet ID in the website source.

## Booking behavior
- All requests start in `รอตรวจสอบ`.
- A booking is rejected if an active booking already occupies the same date and time. `LockService` serializes the check-and-insert operation.
- Admin can set status to `รอตรวจสอบ`, `ยืนยันแล้ว`, `เสร็จสิ้น`, or `ยกเลิก`. Cancelled slots become available again.
- The form collects only name, phone, optional LINE ID, service, requested date/time and optional note. It does not copy birth details from the astrology calculator form.
- Customers see a reference number after submission. This initial version does not send automatic confirmation messages; Admin must contact the customer.

## Important deployment note
This repository change alone cannot create or deploy a Google Apps Script project inside the user's Google account or set Vercel environment variables. Complete the steps above before accepting live bookings. Until `GAS_WEB_APP_URL` is configured, the API intentionally returns HTTP 503 and does not pretend a booking was saved.

## Verification checklist
- [ ] Admin credentials initialized; initial plaintext properties removed.
- [ ] Booking Sheet created and kept private.
- [ ] Apps Script deployed as Web App and URL configured in Vercel.
- [ ] Test booking appears in the private Sheet.
- [ ] Admin login can list and update the same booking.
- [ ] Duplicate date/time is rejected.
- [ ] Invalid and past date/time are rejected.
- [ ] Customer input is rendered with textContent in Admin (no HTML injection).
- [ ] Test on mobile and desktop before public launch.
