const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const KBSV_API_URL = 'https://mablesasapiuat.kbsec.com.vn/kb-connect-api-2';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const ADVISOR_USER_ID = '4a935588-c12e-4fb9-87a3-1af7de74ef62';
const TEST_ACCOUNT = '0001006669';
const TEST_ACCOUNT_NUMBER = '091C006669.MA';

function generateAlphanumericId(prefix = 'id') {
  return prefix + Date.now() + Math.random().toString(36).substring(2, 8);
}

async function runTests() {
  console.log('Fetching active UAT token...');
  const { data: tokenRow } = await supabase
    .from('kbsv_tokens')
    .select('*')
    .eq('advisor_user_id', ADVISOR_USER_ID)
    .single();

  const token = tokenRow.access_token;

  const orders = [
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
      orderSubType: "LO",
      expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const testHeaders = async (label, headers) => {
    const globalReqId = generateAlphanumericId('req');
    const batchBody = {
      requestId: globalReqId,
      otpType: 'core-email-otp',
      transactionId: 'kbsv_order.13184',
      otp: '123456',
      orders: orders
    };

    // Encrypt via /order/api/v1/encrypt
    const encryptHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-device': 'FINPEACE-SERVER-0001-AAAA-BBBBBBBBBBBB',
      'x-devicetype': 'UDID',
      'x-client-id': '118.71.38.54', // standard client IP
      'x-lang': 'vi',
      ...headers
    };

    const encryptResp = await fetch(`${KBSV_API_URL}/order/api/v1/encrypt`, {
      method: 'POST',
      headers: encryptHeaders,
      body: JSON.stringify(batchBody)
    });

    if (!encryptResp.ok) {
      console.log(`[${label}] Encryption failed: ${encryptResp.status}`);
      return;
    }

    const encryptedText = await encryptResp.text();
    let finalBody = encryptedText;
    try {
      const encryptedObj = JSON.parse(encryptedText);
      encryptedObj.requestId = globalReqId;
      finalBody = JSON.stringify(encryptedObj);
    } catch {}

    // Place via /cond-order/api/v1/cond-order/place-batch-order
    const placeResp = await fetch(`${KBSV_API_URL}/cond-order/api/v1/cond-order/place-batch-order?requestId=${globalReqId}`, {
      method: 'POST',
      headers: encryptHeaders,
      body: finalBody
    });

    const respText = await placeResp.text();
    console.log(`[${label}] status=${placeResp.status} response=${respText.slice(0, 300)}`);
  };

  console.log('--- STARTING VIA DIAGNOSTIC TESTS ---');

  // Test A: x-via: '6'
  await testHeaders('Test A: x-via=6', { 'x-via': '6' });

  // Test B: x-via: '6', x-client-id: 'finpeace'
  await testHeaders('Test B: x-via=6, client=finpeace', { 'x-via': '6', 'x-client-id': 'finpeace' });

  // Test C: No x-via, x-client-id: 'finpeace'
  await testHeaders('Test C: No x-via, client=finpeace', { 'x-client-id': 'finpeace' });
}

runTests();
