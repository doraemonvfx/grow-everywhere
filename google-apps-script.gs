function doPost(e) {
  try {
    var SHEET_NAME = "Leads";
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
      sheet.appendRow([
        "Timestamp",
        "Name",
        "Email",
        "Phone",
        "Business Name",
        "Service",
        "Message"
      ]);
    }

    // Guard against missing/empty postData
    var body = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";
    var data = JSON.parse(body);

    sheet.appendRow([
      new Date(),
      data.name || "",
      data.email || "",
      data.phone || "",
      data.business || "",
      data.service || "",
      data.message || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: "Lead saved"
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: "Error: " + err.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: lets you sanity-check the deployed URL in a browser
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: "Web app is live. Use POST to submit leads."
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
