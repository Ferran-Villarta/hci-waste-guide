// Tiny local web server (no install needed): node tools/serve.js [port]
// Opens the site at http://localhost:8080 . Only for testing on your computer.
var http = require('http');
var fs = require('fs');
var path = require('path');

var root = path.resolve(__dirname, '..');
var port = parseInt(process.argv[2], 10) || 8080;
var types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

http.createServer(function (req, res) {
  var url = decodeURIComponent(req.url.split('?')[0]);
  var file = path.join(root, url === '/' ? 'index.html' : url);
  if (file.indexOf(root) !== 0) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(file, function (err, data) {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  });
}).listen(port, '127.0.0.1', function () {
  console.log('Serving ' + root + ' at http://localhost:' + port);
});
