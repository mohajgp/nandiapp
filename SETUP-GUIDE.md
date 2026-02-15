# Nandi Business Awards — Google Sheets Setup Guide

This guide shows how to connect the website to Google Sheets so that nominations and votes are saved centrally (not just in browser localStorage).

---

## Step 1: Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet.
2. Rename it to **"Nandi Business Awards 2026"**.
3. Create **two sheets (tabs)** at the bottom:
   - **Nominations** (rename "Sheet1" to this)
   - **Votes** (add a new sheet and rename it)

4. In the **Nominations** sheet, add these headers in Row 1:

   | A | B | C | D | E | F | G | H | I | J | K |
   |---|---|---|---|---|---|---|---|---|---|---|
   | ID | Timestamp | Business Name | Category | Membership | Owner Name | Phone | Email | Location | M-Pesa Ref | Justification |

5. In the **Votes** sheet, add these headers in Row 1:

   | A | B | C | D |
   |---|---|---|---|
   | Phone | Nominee ID | Category | Voted At |

---

## Step 2: Add the Google Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**.
2. Delete any existing code in `Code.gs`.
3. Paste the entire code from the file `google-apps-script.gs` (included in this folder).
4. Click **Save** (Ctrl+S / Cmd+S).

---

## Step 3: Deploy as Web App

1. In the Apps Script editor, click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Description**: "Nandi Business Awards API"
   - **Execute as**: **Me** (your Google account)
   - **Who has access**: **Anyone**
4. Click **Deploy**.
5. **Authorize** when prompted (click through the "unsafe" warning — this is your own script).
6. **Copy the Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```

---

## Step 4: Connect the Website

1. Open `app.js` in the website folder.
2. Find this line near the top:
   ```javascript
   const GOOGLE_SCRIPT_URL = '';
   ```
3. Paste your Web App URL between the quotes:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
   ```
4. Save and redeploy the website.

---

## Step 5: Test

1. Open the website and submit a test nomination.
2. Check the Google Sheet — the nomination should appear in the **Nominations** tab.
3. Go to the voting page, enter a phone number, and vote.
4. Check the **Votes** tab in the Google Sheet.

---

## How It Works

- **Nominations**: When someone submits the form, the data is sent to Google Apps Script, which appends a row to the Nominations sheet.
- **Votes**: When someone votes, the phone number + nominee + category is sent to the Votes sheet. The script checks for duplicates (same phone + same category) and rejects repeat votes.
- **Fallback**: If the Google connection fails (or isn't configured), data is saved in the browser's localStorage as a backup. The admin can export this as CSV.

---

## Updating Nominees for Voting

Edit the file `assets/nominees.json` to add verified nominees. Each nominee needs:

```json
{
  "id": "unique-id",
  "name": "Business Name",
  "category": "Category Name",
  "tag": "sme"
}
```

Tags must be one of: `sme`, `sector`, `impact`, `special` (these match the filter buttons).

---

## Notes

- The Google Sheet acts as your database — no server needed.
- Only you (the sheet owner) can see the data.
- To give the Nandi team access, share the Google Sheet with their email.
- The "Anyone" access on the web app means anyone can *submit* data, but only sheet editors can *read* it.
- For extra security, you can add a secret key in the Apps Script and website code.

---

© KNCCI Nandi Chapter
