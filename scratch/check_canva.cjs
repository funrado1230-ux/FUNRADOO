const https = require('https');

const url = 'https://www.canva.com/design/DAHQKzeKXLk/bgZVJyztn0WsQ5uN6r_XCA/view';

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
  if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
    console.log('Redirecting to:', res.headers.location);
    return;
  }
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Page length:', data.length);
    const media = data.match(/https:\/\/[^"'\s]+\.(mp4|webm|png|jpg|jpeg)/gi);
    console.log('Media URLs found:', media ? media.slice(0, 10) : 'None');
  });
});
