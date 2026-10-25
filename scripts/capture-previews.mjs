import { spawn, spawnSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const dist = path.resolve('dist');
const mimeTypes = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8', '.woff2': 'font/woff2',
};
const browserExe = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium-browser',
].find((file) => fs.existsSync(file));

if (!browserExe) {
  console.log('No supported browser found for preview capture. Skipping.');
  process.exit(0);
}

const server = http.createServer((req, res) => {
  let reqPath;
  try { reqPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end(); return; }
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  let filePath = path.join(dist, reqPath);
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) filePath += '.html';
  if (!fs.existsSync(filePath) && fs.existsSync(path.join(filePath, 'index.html'))) filePath = path.join(filePath, 'index.html');
  if (!filePath.startsWith(dist + path.sep) && filePath !== path.join(dist, 'index.html')) {
    res.writeHead(403).end();
  } else if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else res.writeHead(404).end('Not found');
});

const targets = [
  { route: '/', out: 'en-home-desktop.png', width: 1440, height: 900 },
  { route: '/es/', out: 'es-home-mobile.png', width: 375, height: 812, mobile: true },
  { route: '/', out: 'dark-home-desktop.png', width: 1440, height: 900, dark: true },
  { route: '/cv/', out: 'en-cv-desktop.png', width: 1440, height: 900 },
  { route: '/research/', out: 'dark-research-desktop.png', width: 1440, height: 900, dark: true, testLoop: true },
  { route: '/es/projects/', out: 'es-projects-mobile.png', width: 375, height: 812, mobile: true },
  { route: '/es/cv/', out: 'es-cv-mobile.png', width: 375, height: 812, mobile: true },
];
const previewDir = path.resolve('docs/preview');
const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'web-personal-chrome-'));
let chromeProc;
let siteUrl;
let cdpUrl;
let launchError;

async function waitFor(predicate, label) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    if (launchError) throw launchError;
    const result = await predicate();
    if (result) return result;
    if (chromeProc?.exitCode !== null && chromeProc?.exitCode !== undefined) throw new Error(`Browser exited with ${chromeProc.exitCode} while waiting for ${label}`);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out waiting for ${label}`);
}

async function capture(target) {
  const pageResponse = await fetch(`${cdpUrl}/json/new?${encodeURIComponent(siteUrl + target.route)}`, { method: 'PUT' });
  if (!pageResponse.ok) throw new Error(`Could not create browser page: ${pageResponse.status}`);
  const page = await pageResponse.json();
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let settled = false;
  let timeout;
  const exceptions = [];
  try {
    await new Promise((resolve, reject) => {
      timeout = setTimeout(() => { settled = true; reject(new Error(`Timed out capturing ${target.route}`)); }, 20000);
      let id = 0;
      const pending = new Map();
      const send = (method, params = {}) => new Promise((res, rej) => {
        const requestId = ++id;
        pending.set(requestId, { res, rej });
        ws.send(JSON.stringify({ id: requestId, method, params }));
      });
      ws.onmessage = ({ data }) => {
        const message = JSON.parse(data);
        if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text);
        if (message.id && pending.has(message.id)) {
          const { res, rej } = pending.get(message.id);
          pending.delete(message.id);
          message.error ? rej(new Error(message.error.message)) : res(message.result);
        }
      };
      ws.onerror = () => { if (!settled) { settled = true; reject(new Error(`CDP WebSocket failed for ${target.route}`)); } };
      ws.onclose = () => { if (!settled) { settled = true; reject(new Error(`CDP WebSocket closed unexpectedly for ${target.route}`)); } };
      ws.onopen = async () => {
        try {
          await send('Runtime.enable');
          await send('Page.enable');
          if (target.testLoop) await send('Page.addScriptToEvaluateOnNewDocument', { source: `(() => {
            const raf = window.requestAnimationFrame.bind(window); let pending = 0, maxPending = 0;
            window.requestAnimationFrame = (callback) => { pending++; maxPending = Math.max(maxPending, pending); return raf((time) => { pending--; callback(time); }); };
            window.__rafStats = () => ({ pending, maxPending });
          })()` });
          await send('Emulation.setEmulatedMedia', { media: 'screen', features: [
            { name: 'prefers-color-scheme', value: target.dark ? 'dark' : 'light' },
            { name: 'prefers-reduced-motion', value: 'no-preference' },
          ] });
          await send('Emulation.setDeviceMetricsOverride', { width: target.width, height: target.height, deviceScaleFactor: 1, mobile: !!target.mobile, fitWindow: false });
          await send('Page.navigate', { url: siteUrl + target.route });
          await send('Emulation.setEmulatedMedia', { media: 'screen', features: [
            { name: 'prefers-color-scheme', value: target.dark ? 'dark' : 'light' },
            { name: 'prefers-reduced-motion', value: 'no-preference' },
          ] });
          await new Promise((r) => setTimeout(r, 700));

          const evaluate = async (expression) => {
            const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
            if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
            return result.result.value;
          };
          const metrics = await evaluate('JSON.stringify({ width: innerWidth, scroll: document.documentElement.scrollWidth })');
          const { width, scroll } = JSON.parse(metrics);
          if (scroll > width) throw new Error(`Horizontal overflow on ${target.route}: ${scroll}px > ${width}px`);
          if (exceptions.length) throw new Error(`JavaScript error on ${target.route}: ${exceptions.join('; ')}`);
          await send('Page.captureScreenshot').then(({ data }) => fs.writeFileSync(path.join(previewDir, target.out), Buffer.from(data, 'base64')));
          if (target.testLoop) {
            await evaluate(`(async () => {
              const button = (name) => document.querySelector('[data-loop="' + name + '"]');
              const revealed = () => [...document.querySelectorAll('[data-gen]')].filter((bar) => bar.dataset.pending === 'false').length;
              button('next').click();
              const nextDeadline = Date.now() + 2000;
              while (revealed() !== 2 && Date.now() < nextDeadline) await new Promise((resolve) => setTimeout(resolve, 20));
              if (revealed() !== 2) throw Error('Next did not reveal generation 1');
              button('reset').click(); await new Promise((resolve) => setTimeout(resolve, 20));
              if (revealed() !== 1) throw Error('Reset did not return to generation 0');
              button('play').click();
              const deadline = Date.now() + 16000;
              while ((revealed() !== 6 || button('play').getAttribute('aria-pressed') !== 'false') && Date.now() < deadline) await new Promise((resolve) => setTimeout(resolve, 50));
              if (revealed() !== 6 || button('play').getAttribute('aria-pressed') !== 'false') throw Error('Play did not finish the loop');
              if (window.__rafStats().maxPending > 1) throw Error('More than one animation frame was pending: ' + JSON.stringify(window.__rafStats()));
            })()`);
            await evaluate(`(async () => {
              const button = (name) => document.querySelector('[data-loop="' + name + '"]');
              button('play').click();
              await new Promise((resolve) => setTimeout(resolve, 80));
              if (button('play').getAttribute('aria-pressed') !== 'true') throw Error('Play did not start before motion preference changed');
            })()`);
            await send('Emulation.setEmulatedMedia', { media: 'screen', features: [
              { name: 'prefers-color-scheme', value: 'dark' },
              { name: 'prefers-reduced-motion', value: 'reduce' },
            ] });
            await evaluate(`(async () => {
              const button = (name) => document.querySelector('[data-loop="' + name + '"]');
              const revealed = () => [...document.querySelectorAll('[data-gen]')].filter((bar) => bar.dataset.pending === 'false').length;
              if (!matchMedia('(prefers-reduced-motion: reduce)').matches) throw Error('Reduced-motion preference was not applied');
              const deadline = Date.now() + 2000;
              while (button('play').getAttribute('aria-pressed') !== 'false' && Date.now() < deadline) await new Promise((resolve) => setTimeout(resolve, 20));
              if (revealed() !== 6 || button('play').getAttribute('aria-pressed') !== 'false') throw Error('Reduced-motion Play did not complete immediately');
            })()`);
          }
          if (exceptions.length) throw new Error(`JavaScript error on ${target.route}: ${exceptions.join('; ')}`);
          clearTimeout(timeout);
          settled = true;
          resolve();
        } catch (error) {
          clearTimeout(timeout);
          settled = true;
          reject(error);
        }
      };
    });
  } finally {
    clearTimeout(timeout);
    ws.close();
    await fetch(`${cdpUrl}/json/close/${page.id}`).catch(() => {});
  }
  console.log(`Saved ${target.out} (${target.width}px; no overflow or runtime errors)`);
}

try {
  await new Promise((resolve, reject) => server.listen(0, '127.0.0.1', resolve).once('error', reject));
  siteUrl = `http://127.0.0.1:${server.address().port}`;
  chromeProc = spawn(browserExe, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profileDir}`, '--disable-gpu', '--no-sandbox', 'about:blank'], { stdio: 'ignore' });
  chromeProc.once('error', (error) => { launchError = error; });
  const activePortFile = path.join(profileDir, 'DevToolsActivePort');
  const cdpPort = await waitFor(async () => fs.existsSync(activePortFile) ? Number(fs.readFileSync(activePortFile, 'utf8').split(/\r?\n/)[0]) : null, 'Chrome DevTools');
  cdpUrl = `http://127.0.0.1:${cdpPort}`;
  await waitFor(async () => { try { return (await fetch(`${cdpUrl}/json/version`)).ok; } catch { return false; } }, 'Chrome DevTools endpoint');
  fs.mkdirSync(previewDir, { recursive: true });
  for (const target of targets) await capture(target);
  console.log('Preview capture and browser checks passed.');
} finally {
  if (chromeProc?.exitCode === null) {
    if (process.platform === 'win32') spawnSync('taskkill.exe', ['/PID', String(chromeProc.pid), '/T', '/F'], { stdio: 'ignore' });
    else chromeProc.kill();
    await Promise.race([new Promise((resolve) => chromeProc.once('exit', resolve)), new Promise((resolve) => setTimeout(resolve, 3000))]);
  }
  await new Promise((resolve) => server.close(resolve));
  if (path.dirname(profileDir) !== os.tmpdir() || !path.basename(profileDir).startsWith('web-personal-chrome-')) throw new Error('Refusing to remove unexpected browser profile path');
  for (let attempt = 0; ; attempt++) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); break; }
    catch (error) {
      if (attempt === 9) throw error;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
}
