/**
 * ══════════════════════════════════════════════════════════════
 * TRAVEL APP BACKUP - Google Apps Script
 * ══════════════════════════════════════════════════════════════
 *
 * SETUP INSTRUCTIONS:
 *
 * 1. Create a new Google Sheet in your Google Workspace
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Click "Deploy" > "New deployment"
 * 5. Choose "Web app" as the type
 * 6. Set:
 *    - Description: "Travel App Backup v1"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (or "Anyone with Google Account" for extra security)
 * 7. Click "Deploy" and authorize the app
 * 8. Copy the Web App URL (looks like: https://script.google.com/macros/s/xxx/exec)
 * 9. Paste the URL in your Travel App settings
 *
 * SHEET STRUCTURE (auto-created):
 * - Sheet "backups": timestamp, tripId, type, data
 * - Sheet "latest": tripId, dates, activities, expenses, members, updatedAt
 */

// Configuration
const SHEET_BACKUPS = 'backups';
const SHEET_LATEST = 'latest';

/**
 * Initialize sheets if they don't exist
 */
function initSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Create 'latest' sheet for quick access to current data
  let latestSheet = ss.getSheetByName(SHEET_LATEST);
  if (!latestSheet) {
    latestSheet = ss.insertSheet(SHEET_LATEST);
    latestSheet.appendRow(['tripId', 'dates', 'activities', 'expenses', 'members', 'updatedAt']);
    latestSheet.getRange(1, 1, 1, 6).setFontWeight('bold');
  }

  // Create 'backups' sheet for history
  let backupsSheet = ss.getSheetByName(SHEET_BACKUPS);
  if (!backupsSheet) {
    backupsSheet = ss.insertSheet(SHEET_BACKUPS);
    backupsSheet.appendRow(['timestamp', 'tripId', 'type', 'data']);
    backupsSheet.getRange(1, 1, 1, 4).setFontWeight('bold');
  }

  return { latestSheet, backupsSheet };
}

/**
 * Handle GET requests (Import/Fetch data)
 */
function doGet(e) {
  try {
    const tripId = e.parameter.tripId;
    const action = e.parameter.action || 'fetch';

    if (!tripId) {
      return jsonResponse({ error: 'Missing tripId parameter' }, 400);
    }

    const { latestSheet } = initSheets();

    // Find the row with this tripId
    const data = latestSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === tripId) {
        const backup = {
          tripId: data[i][0],
          dates: JSON.parse(data[i][1] || '[]'),
          activities: JSON.parse(data[i][2] || '{}'),
          expenses: JSON.parse(data[i][3] || '{}'),
          members: JSON.parse(data[i][4] || '[]'),
          updatedAt: data[i][5]
        };
        return jsonResponse({ success: true, data: backup });
      }
    }

    return jsonResponse({ success: true, data: null, message: 'No backup found for this trip' });

  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}

/**
 * Handle POST requests (Export/Save data)
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const { tripId, dates, activities, expenses, members, action } = payload;

    if (!tripId) {
      return jsonResponse({ error: 'Missing tripId' }, 400);
    }

    const { latestSheet, backupsSheet } = initSheets();
    const timestamp = new Date().toISOString();

    // Save to backups history
    backupsSheet.appendRow([
      timestamp,
      tripId,
      action || 'export',
      JSON.stringify({ dates, activities, expenses, members })
    ]);

    // Update or insert in 'latest' sheet
    const data = latestSheet.getDataRange().getValues();
    let found = false;

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === tripId) {
        // Update existing row
        latestSheet.getRange(i + 1, 2, 1, 5).setValues([[
          JSON.stringify(dates || []),
          JSON.stringify(activities || {}),
          JSON.stringify(expenses || {}),
          JSON.stringify(members || []),
          timestamp
        ]]);
        found = true;
        break;
      }
    }

    if (!found) {
      // Insert new row
      latestSheet.appendRow([
        tripId,
        JSON.stringify(dates || []),
        JSON.stringify(activities || {}),
        JSON.stringify(expenses || {}),
        JSON.stringify(members || []),
        timestamp
      ]);
    }

    return jsonResponse({
      success: true,
      message: 'Backup saved successfully',
      timestamp: timestamp
    });

  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}

/**
 * Helper: Create JSON response
 */
function jsonResponse(data, status = 200) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function - run this to verify setup
 */
function testSetup() {
  initSheets();
  Logger.log('Sheets initialized successfully!');
}
