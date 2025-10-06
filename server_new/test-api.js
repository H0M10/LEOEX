const http = require('http');

function healthCheck() {
  const options = { hostname: 'leoex-production.up.railway.app', port: 8080, path: '/health', method: 'GET' };
  const req = http.request(options, (res) => {
    console.log('Health status', res.statusCode);
    res.on('data', d => process.stdout.write(d));
    res.on('end', () => startGame());
  });
  req.on('error', e => console.error('Health check error', e.message));
  req.end();
}

function startGame() {
  const postData = JSON.stringify({ scenario: 'operator' });
  const options = { hostname: 'leoex-production.up.railway.app', port: 8080, path: '/api/game/start', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) } };
  const req = http.request(options, (res) => {
    console.log('\nStart status', res.statusCode);
    let body = '';
    res.on('data', c=> body += c);
    res.on('end', ()=> console.log('Body:', body));
  });
  req.on('error', e=> console.error('Start error', e.message));
  req.write(postData);
  req.end();
}

healthCheck();
