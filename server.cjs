const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, 'dist');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server = http.createServer((req,res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400); res.end('Bad request'); return; }
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep) || path.relative(root,file).split(path.sep).some(p=>p.startsWith('.'))) { res.writeHead(403); res.end('Forbidden'); return; }
  fs.stat(file, (err,stat) => {
    if (err || !stat.isFile()) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    if (req.method === 'HEAD') res.end(); else fs.createReadStream(file).pipe(res);
  });
});
server.on('error',err=>{ if(err.code==='EADDRINUSE') server.listen(0,'127.0.0.1'); else {console.error(err);process.exitCode=1;} });
server.listen(Number(process.env.PORT)||4178,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+server.address().port));
server.on('listening',()=>{ if(server.address().port!==4178) console.log('Local: http://127.0.0.1:'+server.address().port); });
