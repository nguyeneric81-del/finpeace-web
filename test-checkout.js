const http = require('http');

const body = JSON.stringify({
  userId: '1a10e156-59fa-4cf3-9337-da028e37eddf',
  tierToUpgrade: 'BRONZE',
  amount: 295000
});

const req = http.request(
  {
    hostname: 'localhost',
    port: 3000,
    path: '/api/stockpick/checkout',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': body.length
    }
  },
  res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('Response:', res.statusCode, data));
  }
);
req.on('error', console.error);
req.write(body);
req.end();
