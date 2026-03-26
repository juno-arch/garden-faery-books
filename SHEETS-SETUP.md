# Google Sheets Backend Setup

## Step 1: Create the Google Sheet

1. Go to https://sheets.new
2. Name it "Garden Beds Pro — Leads"
3. In row 1, add these headers (one per column):
   - A1: `id`
   - B1: `name`
   - C1: `contact`
   - D1: `location`
   - E1: `notes`
   - F1: `status`
   - G1: `created`
4. Name the sheet tab "Leads" (click the tab at the bottom to rename)

## Step 2: Add the Apps Script

1. In the sheet, go to **Extensions → Apps Script**
2. Delete everything in the code editor
3. Paste the code from `apps-script.js` (in this folder)
4. Click **Deploy → New deployment**
5. Click the gear icon → select **Web app**
6. Set "Execute as" to **Me**
7. Set "Who has access" to **Anyone**
8. Click **Deploy**
9. Copy the web app URL — it looks like: `https://script.google.com/macros/s/XXXXX/exec`

## Step 3: Connect the App

1. Open the Garden Beds Pro app
2. Go to Settings (or the Leads tab)
3. Paste the web app URL when prompted
4. Your leads will now sync across all devices!

## That's it!

Any device that opens the app will read/write from the same Google Sheet. You can also view and edit leads directly in the spreadsheet.
