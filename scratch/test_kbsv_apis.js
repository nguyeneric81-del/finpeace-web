const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const KBSV_API_URL = process.env.KBSV_API_URL || 'https://mablesasapiuat.kbsec.com.vn/kb-connect-api-2';
const KBSV_DEVICE_ID = process.env.KBSV_DEVICE_ID || 'FINPEACE-SERVER-0001-AAAA-BBBBBBBBBBBB';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const ADVISOR_USER_ID = '4a935588-c12e-4fb9-87a3-1af7de74ef62';

function makeKbsvHeaders(token, contentType = 'application/json') {
  return {
    'Content-Type': contentType,
    'Authorization': `Bearer ${token}`,
    'x-device': KBSV_DEVICE_ID,
    'x-devicetype': 'UDID',
    'x-client-id': '1.1.1.1',
    'x-lang': 'vi',
  };
}

async function testFlow() {
  console.log('1. Loading token from DB...');
  const { data: tokenRow, error: tokenError } = await supabase
    .from('kbsv_tokens')
    .select('*')
    .eq('advisor_user_id', ADVISOR_USER_ID)
    .single();

  if (tokenError || !tokenRow) {
    console.error('Failed to fetch token:', tokenError);
    return;
  }

  const token = tokenRow.access_token;
  console.log(`Token loaded. Expiry: ${tokenRow.access_expires_at}. Status: ${tokenRow.status}`);

  console.log('\n2. Calling GET /profile/api/v1/accounts...');
  let accounts = [];
  try {
    const resp = await fetch(`${KBSV_API_URL}/profile/api/v1/accounts`, {
      headers: makeKbsvHeaders(token)
    });
    console.log(`Accounts Status: ${resp.status}`);
    const text = await resp.text();
    console.log(`Accounts Response: ${text}`);
    const json = JSON.parse(text);
    if (json.s === 'ok' && Array.isArray(json.d)) {
      accounts = json.d;
    }
  } catch (err) {
    console.error('Error fetching accounts:', err);
  }

  if (accounts.length === 0) {
    console.log('No UAT accounts returned. Stopping test.');
    return;
  }

  const testAccount = accounts[0].id || accounts[0].accountId;
  console.log(`\nUsing primary test account: ${testAccount}`);

  console.log('\n3. Fetching Sức mua (available-trade)...');
  try {
    const resp = await fetch(`${KBSV_API_URL}/profile/api/v1/available-trade?accountId=${testAccount}&symbol=HPG`, {
      headers: makeKbsvHeaders(token)
    });
    console.log(`Available Trade Status: ${resp.status}`);
    const text = await resp.text();
    console.log(`Available Trade Response: ${text}`);
  } catch (err) {
    console.error('Error fetching available trade:', err);
  }

  console.log('\n4. Fetching Tài sản (account-assets)...');
  try {
    const resp = await fetch(`${KBSV_API_URL}/profile/api/v1/account-assets?accountId=${testAccount}`, {
      headers: makeKbsvHeaders(token)
    });
    console.log(`Account Assets Status: ${resp.status}`);
    const text = await resp.text();
    console.log(`Account Assets Response: ${text}`);
  } catch (err) {
    console.error('Error fetching account assets:', err);
  }

  console.log('\n5. Fetching Danh mục (portfolio)...');
  try {
    const resp = await fetch(`${KBSV_API_URL}/profile/api/v1/portfolio?accountId=${testAccount}`, {
      headers: makeKbsvHeaders(token)
    });
    console.log(`Portfolio Status: ${resp.status}`);
    const text = await resp.text();
    console.log(`Portfolio Response: ${text}`);
  } catch (err) {
    console.error('Error fetching portfolio:', err);
  }

  console.log('\n6. Testing OTP Send via Proxy-like flow (calls /api/v1/otp/send via /order service)...');
  console.log('Since it requires JWE encryption, we call KBSV /api/v1/encrypt first.');
  try {
    const otpBody = {
      requestId: Math.random().toString(36).substring(2, 15),
      otpType: 'core-email-otp',
      accountId: testAccount
    };

    console.log('Encrypting OTP payload...');
    const encryptResp = await fetch(`${KBSV_API_URL}/order/api/v1/encrypt`, {
      method: 'POST',
      headers: makeKbsvHeaders(token),
      body: JSON.stringify(otpBody)
    });

    console.log(`Encrypt Status: ${encryptResp.status}`);
    const encryptedText = await encryptResp.text();
    console.log(`Encrypted JWE Body length: ${encryptedText.length}`);

    if (encryptResp.ok && encryptedText) {
      console.log('Sending OTP via /api/v1/otp/send...');
      const otpResp = await fetch(`${KBSV_API_URL}/order/api/v1/otp/send`, {
        method: 'POST',
        headers: makeKbsvHeaders(token),
        body: encryptedText
      });

      console.log(`OTP Send Status: ${otpResp.status}`);
      const otpText = await otpResp.text();
      console.log(`OTP Send Response: ${otpText}`);
    } else {
      console.error('Failed to encrypt OTP payload via KBSV UAT encrypt endpoint.');
    }
  } catch (err) {
    console.error('Error in OTP Send flow:', err);
  }
}

testFlow();
