const fs = require('fs');
const https = require('https');

const envFile = fs.readFileSync('.env', 'utf8');
const keyLine = envFile.split('\n').find(line => line.startsWith('GEMINI_API_KEY='));
const key = keyLine.split('=')[1].trim();

https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    if (json.models) {
      json.models.forEach(m => console.log(m.name));
    } else {
      console.log(json);
    }
  });
});
