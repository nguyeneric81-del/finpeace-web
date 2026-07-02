const ADVISOR_USER_ID = 'b1b4ec4e-f1e8-433d-a32e-741b20e068c4';
const TEST_ACCOUNT = '0001006669';
const TEST_ACCOUNT_NUMBER = '091C006669.MA';

async function run() {
  const testCombo = async (label, customHeaders = {}) => {
    const reqId = 'req_loc_' + Date.now() + Math.random().toString(36).substring(2, 5);
    const batchBody = {
      requestId: reqId,
      otpType: 'core-email-otp',
      transactionId: 'kbsv_order.13189',
      otp: '539139',
      orders: [
        {
          refId: 'ref_loc_' + Date.now() + Math.random().toString(36).substring(2, 5),
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
      ]
    };

    const res = await fetch(`http://localhost:3000/api/kbsv/proxy/place-batch-order?advisor_user_id=${ADVISOR_USER_ID}&requestId=${reqId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Instruct our proxy to override headers for testing (we will handle these override headers in proxy route.ts!)
        ...customHeaders
      },
      body: JSON.stringify(batchBody)
    });

    const json = await res.json();
    console.log(`[${label}] status=${res.status} res=${JSON.stringify(json.data || json)}`);
  };

  // Test combinations
  console.log('--- RUNNING LOCAL PROXY HEADER COMBINATIONS ---');
  
  // Test 1: Forced server IP, No x-via
  await testCombo('Test 1: IP=ServerIP, No x-via', { 'x-test-ip': '76.13.181.13' });

  // Test 2: Forced server IP, x-via=6
  await testCombo('Test 2: IP=ServerIP, x-via=6', { 'x-test-ip': '76.13.181.13', 'x-test-via': '6' });

  // Test 3: Standard Client IP, No x-via
  await testCombo('Test 3: IP=ClientIP, No x-via', { 'x-test-ip': '118.71.38.54', 'x-test-via': 'remove' });

  // Test 4: Forced server IP, x-via=4
  await testCombo('Test 4: IP=ServerIP, x-via=4', { 'x-test-ip': '76.13.181.13', 'x-test-via': '4' });
}

run();
