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

  // Let's define the base order template
  const getOrders = (extraOrderParams = {}) => [
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
      expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      ...extraOrderParams
    }
  ];

  // Test Runner helper
  const testPayload = async (label, clientHeader, outerParams = {}, innerOrderParams = {}) => {
    const globalReqId = generateAlphanumericId('req');
    const batchBody = {
      requestId: globalReqId,
      otpType: 'core-email-otp',
      transactionId: 'kbsv_order.13184', // mock or old tx id
      otp: '123456', // mock OTP
      orders: getOrders(innerOrderParams),
      ...outerParams
    };

    // Encrypt
    const encryptHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-device': 'FINPEACE-SERVER-0001-AAAA-BBBBBBBBBBBB',
      'x-devicetype': 'UDID',
      'x-client-id': clientHeader,
      'x-lang': 'vi',
      'x-request-id': globalReqId,
      'x-requestid': globalReqId,
    };

    const encryptResp = await fetch(`${KBSV_API_URL}/cond-order/api/v1/encrypt`, {
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

    // Place
    const placeResp = await fetch(`${KBSV_API_URL}/cond-order/api/v1/cond-order/place-batch-order?requestId=${globalReqId}`, {
      method: 'POST',
      headers: encryptHeaders,
      body: finalBody
    });

    const respText = await placeResp.text();
    console.log(`[${label}] status=${placeResp.status} response=${respText.slice(0, 300)}`);
  };

  // Run various tests
  console.log('--- STARTING DIAGNOSTIC TESTS ---');

  // Test 1: Baseline (current config: x-client-id: 'finpeace')
  await testPayload('Test 1: Client=finpeace, No extra params', 'finpeace');

  // Test 2: Client=kbsv-openid
  await testPayload('Test 2: Client=kbsv-openid, No extra params', 'kbsv-openid');

  // Test 3: Client=finpeace, orders have channel: 'API'
  await testPayload('Test 3: Client=finpeace, order.channel=API', 'finpeace', {}, { channel: 'API' });

  // Test 4: Client=finpeace, orders have channel: 'W'
  await testPayload('Test 4: Client=finpeace, order.channel=W', 'finpeace', {}, { channel: 'W' });

  // Test 5: Client=finpeace, orders have via: 'W'
  await testPayload('Test 5: Client=finpeace, order.via=W', 'finpeace', {}, { via: 'W' });

  // Test 6: Client=finpeace, outer body has channel: 'API'
  await testPayload('Test 6: Client=finpeace, body.channel=API', 'finpeace', { channel: 'API' });

  // Test 7: Client=finpeace, outer body has via: 'API'
  await testPayload('Test 7: Client=finpeace, body.via=API', 'finpeace', { via: 'API' });
}

runTests();
