const http = require('http');

console.log('Testing backend connection...');

const options = {
  hostname: 'localhost',
  port: 9000,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`✅ Backend responding! Status: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log(`Response: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`❌ Backend connection failed: ${e.message}`);
});

req.setTimeout(5000, () => {
  console.error('❌ Backend connection timeout');
  req.destroy();
});

req.end();