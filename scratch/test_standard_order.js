const ADVISOR_USER_ID = 'b1b4ec4e-f1e8-433d-a32e-741b20e068c4';
const TEST_ACCOUNT = '0001006669';
const TEST_ACCOUNT_NUMBER = '091C006669.MA';

async function run() {
  const reqId = 'req_std_' + Date.now();
  // Standard place-order with OTP is a single flat object!
  const orderBody = {
    requestId: reqId,
    otpType: 'core-email-otp',
    transactionId: 'kbsv_order.13189', // UAT transaction ID
    otp: '539139',
    accountId: TEST_ACCOUNT,
    accountNumber: TEST_ACCOUNT_NUMBER,
    side: "B",
    type: "LO",
    symbol: "HPG",
    price: 24700, // Price in VND
    volume: 100,
    expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };

  console.log('Sending standard order request with flat OTP structure to local proxy...');
  const res = await fetch(`http://localhost:3000/api/kbsv/proxy/place-order?advisor_user_id=${ADVISOR_USER_ID}&requestId=${reqId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderBody)
  });

  console.log(`[STANDARD TEST] status=${res.status}`);
  console.log('response:', await res.json());
}

run();
