const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const KBSV_API_URL = 'https://mablesasapiuat.kbsec.com.vn/kb-connect-api-2';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const ADVISOR_USER_ID = 'b1b4ec4e-f1e8-433d-a32e-741b20e068c4'; // correct user
const TEST_ACCOUNT = '0001006669';
const TEST_ACCOUNT_NUMBER = '091C006669.MA';

function generateAlphanumericId(prefix = 'id') {
  return prefix + Date.now() + Math.random().toString(36).substring(2, 8);
}

async function run() {
  console.log('Fetching active UAT token...');
  const { data: tokenRow } = await supabase
    .from('kbsv_tokens')
    .select('*')
    .eq('advisor_user_id', ADVISOR_USER_ID)
    .single();

  const token = tokenRow.access_token;
  const globalReqId = generateAlphanumericId('req');

  // Let's test with orderSubType: 'LO'
  const batchBody = {
    requestId: globalReqId,
    otpType: 'core-email-otp',
    transactionId: 'kbsv_order.13189', // UAT transaction ID
    otp: '539139',
    orders: [
      {
        refId: generateAlphanumericId('buy'),
        condOrderType: "SEO",
        accountId: TEST_ACCOUNT,
        accountNumber: TEST_ACCOUNT_NUMBER,
        symbol: "HPG",
        execType: "B",
        volume: 100,
        orderPrice: 24700,
        activeType: "ONE",
        priceMarketCond: "MATCHING_PRICE",
        orderSubType: "LO", // uppercase LO
        expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'x-device': 'FINPEACE-SERVER-0001-AAAA-BBBBBBBBBBBB',
    'x-devicetype': 'UDID',
    'x-client-id': '118.71.38.54',
    'x-lang': 'vi',
    'x-via': '6',
  };

  // Encrypt via UAT helper
  const encryptResp = await fetch(`${KBSV_API_URL}/cond-order/api/v1/encrypt`, {
    method: 'POST',
    headers,
    body: JSON.stringify(batchBody)
  });

  if (!encryptResp.ok) {
    console.log(`Encryption failed: ${encryptResp.status}`);
    return;
  }

  const encryptedText = await encryptResp.text();
  let finalBody = encryptedText;
  try {
    const encryptedObj = JSON.parse(encryptedText);
    encryptedObj.requestId = globalReqId;
    finalBody = JSON.stringify(encryptedObj);
  } catch {}

  // Place
  const placeResp = await fetch(`${KBSV_API_URL}/cond-order/api/v1/cond-order/place-batch-order?requestId=${globalReqId}`, {
    method: 'POST',
    headers,
    body: finalBody
  });

  console.log(`[TEST LO] status=${placeResp.status} response=${await placeResp.text()}`);
}

run();
