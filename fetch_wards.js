const http = require('http');

const loginReq = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const token = JSON.parse(data).token || JSON.parse(data).Token;
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/Wards',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }, (res2) => {
      let data2 = '';
      res2.on('data', chunk => data2 += chunk);
      res2.on('end', () => console.log(data2));
    });
    req.end();
  });
});
loginReq.write(JSON.stringify({ username: 'superadmin', password: 'password123' }));
loginReq.end();
