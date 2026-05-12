const http = require('http');

http.get('http://localhost:5000/api/trains/search?origin=Hyderabad&destination=Goa&date=2026-05-21', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log(data));
}).on('error', err => console.log('Error:', err.message));
