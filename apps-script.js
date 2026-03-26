/**
 * Google Apps Script — REST API for Garden Faery app
 * Supports both Leads and Clients sheets.
 *
 * Paste this into Extensions → Apps Script in your Google Sheet.
 * Deploy as a web app with "Anyone" access.
 *
 * Your spreadsheet needs two tabs:
 *   1. "Leads"   — columns: id, name, contact, location, notes, status, created
 *   2. "Clients" — columns: id, name, email, phone, location, source, service,
 *                           status, rate, referredBy, firstContact, lastContact,
 *                           followup, notes, created, updated
 */

const LEADS_SHEET = 'Leads';
const CLIENTS_SHEET = 'Clients';

// ===== HELPERS =====

function getSheet(name) {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) {
    // Auto-create sheet with headers if missing
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(name);
    if (name === LEADS_SHEET) {
      sheet.appendRow(['id', 'name', 'contact', 'location', 'notes', 'status', 'created']);
    } else if (name === CLIENTS_SHEET) {
      sheet.appendRow(['id', 'name', 'email', 'phone', 'location', 'source', 'service',
                       'status', 'rate', 'referredBy', 'firstContact', 'lastContact',
                       'followup', 'notes', 'created', 'updated']);
    }
  }
  return sheet;
}

function sheetToJson(sheet) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = [];
  for (let i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    const row = {};
    headers.forEach((h, j) => { row[h] = data[i][j]; });
    rows.push(row);
  }
  return rows;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===== GET — read all leads and clients =====

function doGet(e) {
  const leads = sheetToJson(getSheet(LEADS_SHEET));
  const clients = sheetToJson(getSheet(CLIENTS_SHEET));
  return jsonResponse({ leads, clients });
}

// ===== POST — add / update / delete =====

function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  const target = payload.target || 'leads'; // 'leads' or 'clients'
  const action = payload.action;

  if (target === 'clients') {
    return handleClients(action, payload);
  }
  return handleLeads(action, payload);
}

// ----- Leads -----

function handleLeads(action, payload) {
  const sheet = getSheet(LEADS_SHEET);

  if (action === 'add') {
    const lead = payload.lead;
    const id = lead.id || Utilities.getUuid();
    sheet.appendRow([
      id,
      lead.name || '',
      lead.contact || '',
      lead.location || '',
      lead.notes || '',
      lead.status || 'new',
      lead.created || new Date().toISOString()
    ]);
    return jsonResponse({ success: true, id });
  }

  if (action === 'update') {
    const lead = payload.lead;
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === lead.id) {
        if (lead.name !== undefined) sheet.getRange(i + 1, 2).setValue(lead.name);
        if (lead.contact !== undefined) sheet.getRange(i + 1, 3).setValue(lead.contact);
        if (lead.location !== undefined) sheet.getRange(i + 1, 4).setValue(lead.location);
        if (lead.notes !== undefined) sheet.getRange(i + 1, 5).setValue(lead.notes);
        if (lead.status !== undefined) sheet.getRange(i + 1, 6).setValue(lead.status);
        return jsonResponse({ success: true });
      }
    }
    return jsonResponse({ success: false, error: 'Lead not found' });
  }

  if (action === 'delete') {
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === payload.id) {
        sheet.deleteRow(i + 1);
        return jsonResponse({ success: true });
      }
    }
    return jsonResponse({ success: false, error: 'Lead not found' });
  }

  return jsonResponse({ success: false, error: 'Unknown action' });
}

// ----- Clients -----

function handleClients(action, payload) {
  const sheet = getSheet(CLIENTS_SHEET);

  if (action === 'add') {
    const c = payload.client;
    const id = c.id || Utilities.getUuid();
    sheet.appendRow([
      id,
      c.name || '',
      c.email || '',
      c.phone || '',
      c.location || '',
      c.source || '',
      c.service || '',
      c.status || 'lead',
      c.rate || '',
      c.referredBy || '',
      c.firstContact || '',
      c.lastContact || '',
      c.followup || '',
      c.notes || '',
      c.created || new Date().toISOString(),
      c.updated || new Date().toISOString()
    ]);
    return jsonResponse({ success: true, id });
  }

  if (action === 'update') {
    const c = payload.client;
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === c.id) {
        // Update each field by header position
        headers.forEach((h, j) => {
          if (h !== 'id' && c[h] !== undefined) {
            sheet.getRange(i + 1, j + 1).setValue(c[h]);
          }
        });
        return jsonResponse({ success: true });
      }
    }
    return jsonResponse({ success: false, error: 'Client not found' });
  }

  if (action === 'delete') {
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === payload.id) {
        sheet.deleteRow(i + 1);
        return jsonResponse({ success: true });
      }
    }
    return jsonResponse({ success: false, error: 'Client not found' });
  }

  return jsonResponse({ success: false, error: 'Unknown action' });
}
