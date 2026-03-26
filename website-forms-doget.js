/**
 * ADD THIS to the existing "Garden Faery Forms" Apps Script project.
 * (The one at gardenfaeryy@gmail.com that handles website form submissions.)
 *
 * This adds a doGet handler so the bookkeeping app can pull
 * new contact submissions and subscribers.
 *
 * After pasting, redeploy: Deploy → Manage deployments → Edit → New version → Deploy
 */

function doGet(e) {
  const ss = SpreadsheetApp.openById('1Ii_JYwzMfUtCj_5kWUcwUB7cHFwqykYNgvGwIvsRsOw');

  // Read Contact Submissions
  const contactsSheet = ss.getSheetByName('Contact Submissions');
  const contacts = [];
  if (contactsSheet) {
    const data = contactsSheet.getDataRange().getValues();
    const headers = data[0];
    for (let i = 1; i < data.length; i++) {
      if (!data[i][0] && !data[i][1]) continue; // skip empty rows
      const row = {};
      headers.forEach((h, j) => { row[h] = data[i][j]; });
      contacts.push(row);
    }
  }

  // Read Subscribers
  const subsSheet = ss.getSheetByName('Subscribers');
  const subscribers = [];
  if (subsSheet) {
    const data = subsSheet.getDataRange().getValues();
    const headers = data[0];
    for (let i = 1; i < data.length; i++) {
      if (!data[i][0]) continue;
      const row = {};
      headers.forEach((h, j) => { row[h] = data[i][j]; });
      subscribers.push(row);
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ contacts, subscribers }))
    .setMimeType(ContentService.MimeType.JSON);
}
