function doPost(e) {
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

  var data = JSON.parse(e.postData.contents || "{}");

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
}
