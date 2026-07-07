/**
 * MBOSS Lexon LLP — Contact & Internship Form Handler
 *
 * SETUP INSTRUCTIONS
 * ──────────────────
 * 1. Go to https://script.google.com and create a new project.
 * 2. Paste this entire file into the editor (replace any existing code).
 * 3. Click Deploy → New deployment → Web app.
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the /exec URL that appears.
 * 5. In js/main.js, set CONTACT_SCRIPT_URL to that URL.
 *
 * Run authorizeMail() once manually before going live to grant
 * MailApp permission without waiting for the first real submission.
 *
 * NOTE: this single endpoint handles both the Contact form and the
 * Internship application form (js/main.js sends formType:"internship"
 * for the latter, with the CV attached as base64).
 */

var NOTIFY_EMAIL = "info@mbosslexon.com";
var CAREER_EMAIL = "career@mbosslexon.com";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.formType === "internship") {
      return handleInternshipApplication(data);
    }
    return handleContactEnquiry(data);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleContactEnquiry(data) {
  const name    = data.name    || "-";
  const email   = data.email   || "-";
  const phone   = data.phone   || "-";
  const company = data.company || "-";
  const service = data.service || "-";
  const message = data.message || "-";

  const htmlBody = `
    <h2 style="color:#0d1f3c;font-family:sans-serif;">New Consultation Enquiry</h2>
    <table cellpadding="8" cellspacing="0" border="1"
           style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
      <tr>
        <td style="background:#f5f7fa;"><strong>Name</strong></td>
        <td>${name}</td>
      </tr>
      <tr>
        <td style="background:#f5f7fa;"><strong>Email</strong></td>
        <td><a href="mailto:${email}">${email}</a></td>
      </tr>
      <tr>
        <td style="background:#f5f7fa;"><strong>Phone</strong></td>
        <td>${phone}</td>
      </tr>
      <tr>
        <td style="background:#f5f7fa;"><strong>Company / Organisation</strong></td>
        <td>${company}</td>
      </tr>
      <tr>
        <td style="background:#f5f7fa;"><strong>Service Required</strong></td>
        <td>${service}</td>
      </tr>
      <tr>
        <td style="background:#f5f7fa;"><strong>Message</strong></td>
        <td style="white-space:pre-wrap;">${message}</td>
      </tr>
    </table>
    <br>
    <p style="font-family:sans-serif;font-size:12px;color:#718096;">
      This enquiry was submitted via the mbosslexon.com contact form.
    </p>
  `;

  MailApp.sendEmail({
    to:       NOTIFY_EMAIL,
    subject:  "New Enquiry: " + service + " — " + name,
    htmlBody: htmlBody,
  });

  return ContentService
    .createTextOutput(JSON.stringify({ status: "success", message: "Email sent!" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleInternshipApplication(data) {
  const name         = data.name         || "-";
  const email        = data.email        || "-";
  const phone        = data.phone        || "-";
  const programme    = data.programme    || "-";
  const college      = data.college      || "-";
  const message      = data.message      || "-";

  const htmlBody = `
    <h2 style="color:#0d1f3c;font-family:sans-serif;">New Internship Application</h2>
    <table cellpadding="8" cellspacing="0" border="1"
           style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
      <tr>
        <td style="background:#f5f7fa;"><strong>Name</strong></td>
        <td>${name}</td>
      </tr>
      <tr>
        <td style="background:#f5f7fa;"><strong>Email</strong></td>
        <td><a href="mailto:${email}">${email}</a></td>
      </tr>
      <tr>
        <td style="background:#f5f7fa;"><strong>Phone</strong></td>
        <td>${phone}</td>
      </tr>
      <tr>
        <td style="background:#f5f7fa;"><strong>LL.B. Programme</strong></td>
        <td>${programme}</td>
      </tr>
      <tr>
        <td style="background:#f5f7fa;"><strong>College / University</strong></td>
        <td>${college}</td>
      </tr>
      <tr>
        <td style="background:#f5f7fa;"><strong>Cover Letter</strong></td>
        <td style="white-space:pre-wrap;">${message}</td>
      </tr>
    </table>
    <br>
    <p style="font-family:sans-serif;font-size:12px;color:#718096;">
      This application was submitted via the mbosslexon.com Internship Programme form.
    </p>
  `;

  const mailOptions = {
    to:       CAREER_EMAIL,
    subject:  "New Internship Application — " + name,
    htmlBody: htmlBody,
  };

  if (data.cvBase64 && data.cvFileName) {
    const bytes = Utilities.base64Decode(data.cvBase64);
    const blob  = Utilities.newBlob(bytes, data.cvMimeType || "application/octet-stream", data.cvFileName);
    mailOptions.attachments = [blob];
  }

  MailApp.sendEmail(mailOptions);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "success", message: "Application sent!" }))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Health-check — visit the /exec URL in a browser to confirm deployment. */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", service: "MBOSS Contact Form" }))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Run once manually to pre-authorise MailApp. */
function authorizeMail() {
  MailApp.sendEmail(Session.getActiveUser().getEmail(), "Auth check", "Authorised.");
}
