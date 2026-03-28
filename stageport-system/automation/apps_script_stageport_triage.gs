const CALENDLY_LINK = "https://calendly.com/YOUR_LINK/stageport-triage";
const HOT_REPLY_SUBJECT = "StagePort Triage — Approved";
const WARM_REPLY_SUBJECT = "StagePort — Next Step";
const LOW_REPLY_SUBJECT = "StagePort — Received";

function onFormSubmit(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const row = e.range.getRow();
  const values = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  const data = {};
  headers.forEach((h, i) => data[h] = values[i]);

  const result = scoreLead(data);
  const colMap = getColumnMap(headers);

  sheet.getRange(row, colMap["Score"]).setValue(result.score);
  sheet.getRange(row, colMap["Tier"]).setValue(result.tier);
  sheet.getRange(row, colMap["Reason"]).setValue(result.reason);
  sheet.getRange(row, colMap["Status"]).setValue("NEW");
  sheet.getRange(row, colMap["Booking Link"]).setValue(
    result.tier === "HOT" || result.tier === "WARM" ? CALENDLY_LINK : ""
  );

  if (!data["Auto Reply Sent"]) {
    sendTierEmail(data, result);
    sheet.getRange(row, colMap["Auto Reply Sent"]).setValue("YES");
  }
}

function scoreLead(data) {
  let score = 0;
  const reasons = [];

  const budget = (data["Budget range"] || "").trim();
  const stage = (data["Current stage"] || "").trim();
  const urgency = (data["Timeline urgency"] || "").trim();

  if (budget === "Under $2.5K") score += 5;
  if (budget === "$2.5K–$7.5K") score += 20;
  if (budget === "$7.5K–$15K") score += 30;
  if (budget === "$15K+") score += 40;

  if (stage === "Idea") score += 5;
  if (stage === "MVP") score += 10;
  if (stage === "Live") score += 20;
  if (stage === "Revenue-generating") score += 30;

  if (urgency === "Low") score += 5;
  if (urgency === "Medium") score += 10;
  if (urgency === "High") score += 20;
  if (urgency === "Immediate") score += 30;

  const textBlob = [
    data["What are you building?"] || "",
    data["What is the biggest risk or bottleneck right now?"] || "",
    data["What breaks if this is not fixed in the next 30 days?"] || "",
    data["Anything else I should know?"] || ""
  ].join(" ").toLowerCase();

  const keywords = [
    "building",
    "system",
    "risk",
    "compliance",
    "investor",
    "memory",
    "governance",
    "audit",
    "install"
  ];

  let clarityBonus = 0;
  keywords.forEach(k => {
    if (textBlob.includes(k)) clarityBonus += 5;
  });
  clarityBonus = Math.min(clarityBonus, 20);
  score += clarityBonus;

  if (budget === "$15K+" || budget === "$7.5K–$15K") reasons.push("budget fit");
  if (stage === "Live" || stage === "Revenue-generating") reasons.push("stage maturity");
  if (urgency === "High" || urgency === "Immediate") reasons.push("urgent need");
  if (clarityBonus > 0) reasons.push("clear problem language");

  let tier = "LOW";
  if (score >= 80) tier = "HOT";
  else if (score >= 50) tier = "WARM";

  return {
    score,
    tier,
    reason: reasons.length ? reasons.join(", ") : "low signal"
  };
}

function sendTierEmail(data, result) {
  const email = data["Email"];
  const name = data["Full name"] || "there";
  if (!email) return;

  let subject = LOW_REPLY_SUBJECT;
  let body = "";

  if (result.tier === "HOT") {
    subject = HOT_REPLY_SUBJECT;
    body =
`Hi ${name},

You’re approved for StagePort Triage.

This is the fastest path to map your system, define the real risk boundary, and determine whether a full install is appropriate.

Book here:
${CALENDLY_LINK}

— AVC Systems`;
  } else if (result.tier === "WARM") {
    subject = WARM_REPLY_SUBJECT;
    body =
`Hi ${name},

Thanks — I reviewed your intake.

You look like a fit for StagePort Triage, which is where we map the system, isolate the real structural risk, and define next steps cleanly.

Book here if you want to move:
${CALENDLY_LINK}

— AVC Systems`;
  } else {
    subject = LOW_REPLY_SUBJECT;
    body =
`Hi ${name},

Thanks for submitting your intake.

I received it and will keep it on file. If there’s a fit for a future StagePort engagement, I’ll reach out.

— AVC Systems`;
  }

  GmailApp.sendEmail(email, subject, body);
}

function getColumnMap(headers) {
  const map = {};
  headers.forEach((h, i) => map[h] = i + 1);
  return map;
}
