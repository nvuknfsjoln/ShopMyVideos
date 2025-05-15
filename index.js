// index.js
const http = require('http');
const port = process.env.PORT || 3000;

// Starte Dummy-Webserver (für Render)
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Background Worker läuft!');
}).listen(port, () => {
  console.log(`Dummy-Webserver läuft auf Port ${port}`);
});

// Starte die eigentliche Worker-Logik
require('./worker');
