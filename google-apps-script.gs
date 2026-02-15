/**
 * Nandi Business Awards 2026
 * Google Apps Script — Handles nominations and votes
 * 
 * SETUP:
 * 1. Create a Google Sheet with two tabs: "Nominations" and "Votes"
 * 2. Add headers as described in SETUP-GUIDE.md
 * 3. Paste this code into Extensions → Apps Script
 * 4. Deploy as Web App (Execute as: Me, Access: Anyone)
 * 5. Copy the URL into app.js
 */

// Handle POST requests from the website
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === 'nominate') {
      return handleNomination(data);
    } else if (action === 'vote') {
      return handleVote(data);
    } else {
      return jsonResponse({ success: false, error: 'Unknown action' });
    }
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

// Handle GET requests (for testing)
function doGet(e) {
  return jsonResponse({ status: 'ok', message: 'Nandi Business Awards API is running.' });
}

/**
 * Save a nomination to the Nominations sheet
 */
function handleNomination(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Nominations');

  if (!sheet) {
    return jsonResponse({ success: false, error: 'Nominations sheet not found' });
  }

  // Append row
  sheet.appendRow([
    data.id || '',
    new Date().toISOString(),
    data.businessName || '',
    data.categoryName || data.category || '',
    data.membership || '',
    data.ownerName || '',
    data.phone || '',
    data.email || '',
    data.location || '',
    data.mpesaRef || '',
    data.why || ''
  ]);

  return jsonResponse({ success: true, message: 'Nomination saved' });
}

/**
 * Save a vote to the Votes sheet
 * Checks for duplicates (same phone + same category)
 */
function handleVote(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Votes');

  if (!sheet) {
    return jsonResponse({ success: false, error: 'Votes sheet not found' });
  }

  const phone = (data.phone || '').trim();
  const category = (data.category || '').trim();
  const nomineeId = (data.nomineeId || '').trim();

  if (!phone || !category || !nomineeId) {
    return jsonResponse({ success: false, error: 'Missing required fields' });
  }

  // Check for duplicate vote (same phone + same category)
  const allData = sheet.getDataRange().getValues();
  for (let i = 1; i < allData.length; i++) {
    const rowPhone = String(allData[i][0]).trim();
    const rowCategory = String(allData[i][2]).trim();
    if (rowPhone === phone && rowCategory === category) {
      return jsonResponse({ success: false, error: 'Already voted in this category' });
    }
  }

  // Append vote
  sheet.appendRow([
    phone,
    nomineeId,
    category,
    new Date().toISOString()
  ]);

  return jsonResponse({ success: true, message: 'Vote recorded' });
}

/**
 * Helper: Return JSON response
 */
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
