const sheets = require("../config/googleAuth");
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

async function appendToGoogleSheet(data) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: "Sheet1!A1",
    valueInputOption: "RAW",
    requestBody: {
      values: [data],
    },
  });
}

module.exports = { appendToGoogleSheet };
