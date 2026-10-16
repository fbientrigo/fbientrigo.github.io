import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.woff2': 'font/woff2',
};

const browserExe = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
].find((p) => p && fs.existsSync(p));

if (!browserExe) {
  console.log('No supported browser found for preview capture. Skipping.');
  process.exit(0);
}

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  let filePath = path.join(dist, reqPath);
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) filePath += '.html';
  if (!fs.existsSync(filePath) && fs.existsSync(path.join(filePath, 'index.html'))) filePath = path.join(filePath, 'index.html');

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = 4321;
const CDP_PORT = 9222;

server.listen(PORT, '127.0.0.1', async () => {
  const chromeProc = spawn(browserExe, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--disable-gpu',
    '--no-sandbox',
    'about:blank',
  ]);

  await new Promise((r) => setTimeout(r, 1200));

  const targets = [
    { url: `http://127.0.0.1:${PORT}/`, out: 'en-home-desktop.png', width: 1440, height: 900, mobile: false },
    { url: `http://127.0.0.1:${PORT}/cv/`, out: 'en-cv-desktop.png', width: 1440, height: 900, mobile: false },
    { url: `http://127.0.0.1:${PORT}/research/`, out: 'dark-research-desktop.png', width: 1440, height: 900, mobile: false, dark: true },
    { url: `http://127.0.0.1:${PORT}/es/projects/`, out: 'es-projects-mobile.png', width: 375, height: 812, mobile: true },
    { url: `http://127.0.0.1:${PORT}/es/cv/`, out: 'es-cv-mobile.png', width: 375, height: 812, mobile: true },
  ];

  const previewDir = path.resolve('docs/preview');
  fs.mkdirSync(previewDir, { recursive: true });

  try {
    for (const t of targets) {
      const pageRes = await fetch(`http://127.0.0.1:${CDP_PORT}/json/new`, { method: 'PUT' });
      const page = await pageRes.json();
      const ws = new WebSocket(page.webSocketDebuggerUrl);

      await new Promise((resolve, reject) => {
        let id = 1;
        const callbacks = new Map();

        function send(method, params = {}) {
          return new Promise((res, rej) => {
            const msgId = id++;
            callbacks.set(msgId, { res, rej });
            ws.send(JSON.stringify({ id: msgId, method, params }));
          });
        }

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.id && callbacks.has(data.id)) {
            const { res, rej } = callbacks.get(data.id);
            callbacks.delete(data.id);
            if (data.error) rej(data.error);
            else res(data.result);
          }
        };

        ws.onopen = async () => {
          try {
            await send('Page.enable');
            if (t.dark) {
              await send('Emulation.setEmulatedMedia', {
                media: 'screen',
                features: [{ name: 'prefers-color-scheme', value: 'dark' }],
              });
            }
            await send('Emulation.setDeviceMetricsOverride', {
              width: t.width,
              height: t.height,
              deviceScaleFactor: 1,
              mobile: t.mobile,
              fitWindow: false,
            });
            await send('Page.navigate', { url: t.url });
            await new Promise((r) => setTimeout(r, 600));

            const evalRes = await send('Runtime.evaluate', {
              expression: 'JSON.stringify({ innerWidth: window.innerWidth, scrollWidth: document.documentElement.scrollWidth, bodyScrollWidth: document.body.scrollWidth })',
            });
            console.log(`${t.out} metrics:`, evalRes.result?.value);

            const shot = await send('Page.captureScreenshot', { format: 'png' });
            fs.writeFileSync(path.join(previewDir, t.out), Buffer.from(shot.data, 'base64'));
            console.log(`Saved ${t.out}`);

            await send('Page.close');
            ws.close();
            resolve();
          } catch (err) {
            ws.close();
            reject(err);
          }
        };

        ws.onerror = reject;
      });

      await fetch(`http://127.0.0.1:${CDP_PORT}/json/close/${page.id}`).catch(() => {});
    }
  } finally {
    chromeProc.kill();
    server.close();
  }

  console.log('Previews captured successfully.');
  process.exit(0);
});
