const http = require('http');

setTimeout(() => {
    http.get('http://localhost:5001/api/trains/search?origin=hyderabad&destination=kakinada&date=2026-05-16', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => console.log("Response:", data));
    }).on('error', err => console.log('Error:', err.message));
}, 2000); // wait for server to start
