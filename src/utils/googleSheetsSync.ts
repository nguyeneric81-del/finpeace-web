/**
 * Utility to sync leads to the FinPeace Google Sheet via Apps Script Webhook.
 * It's designed to be non-blocking - fire and forget.
 */

export interface GoogleSheetLeadPayload {
  email?: string;
  phone?: string;
  name?: string;
  agent?: string;      // Organization Code, default to "Org" 
  date?: string;       // ISO date string 
  source?: string;     // The source context (e.g. KB, Landing Page, Account Request)
}

export const syncLeadToGoogleSheet = async (payload: GoogleSheetLeadPayload) => {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log('[GoogleSheets Sync] GOOGLE_SHEETS_WEBHOOK_URL is not set. Skipping sync.');
    return;
  }

  // Set default formatted date if not provided
  if (!payload.date) {
    // Format to Vietnam Time since the sheet is managed in VN
    payload.date = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  }

  // Await fetch to ensure NextJS doesn't kill the request context early
  try {
    console.log('[GoogleSheets Sync] Bắt đầu gửi data:', JSON.stringify(payload));
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      console.error('[GoogleSheets Sync] Server returned an error:', response.status, await response.text());
    } else {
      console.log('[GoogleSheets Sync] Thành công gửi lên DB!');
    }
  } catch (err) {
    console.error('[GoogleSheets Sync] Catch Error:', err);
  }
};
