// Takes a screenshot of every screen and pop-up at phone size, for the portfolio.
// Run: node tools/screenshots.js   (needs Google Chrome installed; uses Node's built-in WebSocket, Node 22+)
// Output: docs/screenshots/NN-name.png (390 x 844 points at 2x, like an iPhone).
var spawn = require('child_process').spawn;
var http = require('http');
var fs = require('fs');
var path = require('path');
var os = require('os');

var ROOT = path.join(__dirname, '..');
var OUT = path.join(ROOT, 'docs', 'screenshots');
var PORT = 8123;
var CHROME = process.env.CHROME || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].filter(function (p) { return fs.existsSync(p); })[0];

var DAY = 864e5;
var now = Date.now();
var SOME_SAVED = { saved: [
  { id: 'glass-jar', ts: now, sorted: true },
  { id: 'pizza-box', ts: now, sorted: false, choice: 0 },
  { id: 'battery', ts: now - 3 * DAY, sorted: false },
  { id: 'banana-peel', ts: now - 4 * DAY, sorted: true },
], autosave: true, recent: [] };
var ALL_SORTED = { saved: [
  { id: 'glass-jar', ts: now, sorted: true },
  { id: 'pizza-box', ts: now, sorted: true, choice: 1 },
  { id: 'diaper', ts: now, sorted: true },
], autosave: true, recent: [] };

// [file name, address, saved data, steps, full page]
// steps: ['click', css] | ['type', css, text] | ['submit', css] | ['wait', ms]
var SHOTS = [
  ['01-home', '#/', null, [], true],
  ['02-search-suggestions', '#/', null, [['type', '#q', 'piz']], false],
  ['03-search-results', '#/search?q=can', null, [], true],
  ['04-did-you-mean', '#/search?q=cardbord', null, [], false],
  ['05-no-result', '#/search?q=bike%20tube', null, [], true],
  ['06-item-blue-bin', '#/item/glass-jar', null, [], true],
  ['07-item-green-bin', '#/item/banana-peel', null, [], true],
  ['08-item-black-bin', '#/item/diaper', null, [], true],
  ['09-item-it-depends', '#/item/pizza-box', null, [], true],
  ['10-item-it-depends-chosen', '#/item/pizza-box', null, [['click', '[data-action="choose"][data-choice="0"]'], ['wait', 1500]], true],
  ['11-item-hazardous', '#/item/battery', null, [], true],
  ['12-item-bottle-depot', '#/item/pop-can', null, [], true],
  ['13-saved', '#/saved', SOME_SAVED, [], true],
  ['14-saved-all-sorted', '#/saved', ALL_SORTED, [], true],
  ['15-saved-how-saving-works', '#/saved', SOME_SAVED, [['click', '[data-action="how-saving"]']], false],
  ['16-saved-remove-undo', '#/saved', SOME_SAVED, [['click', '.remove-btn']], false],
  ['17-a-z', '#/az', null, [], false],
  ['18-a-z-filter', '#/az', null, [['type', '#az-filter', 'bat']], false],
  ['19-categories', '#/categories', null, [], true],
  ['20-category', '#/category/food-packaging', null, [], true],
  ['21-sub-category', '#/category/food-packaging/metal', null, [], true],
  ['22-crash-course-blue', '#/bin/blue', null, [], true],
  ['23-crash-course-drop-off', '#/bin/dropoff', null, [], true],
  ['24-menu', '#/az', null, [['click', '[data-action="menu"]']], false],
  ['25-camera', '#/', null, [['click', '[data-action="photo"]']], false],
  ['26-photo-result', '#/scan/pop-can', null, [], true],
  ['27-photo-not-recognised', '#/', null, [['click', '[data-action="photo"]'], ['click', '[data-action="photo-browse"]']], false],
  ['28-report-missing-item', '#/', null, [['click', '[data-action="photo"]'], ['click', '[data-action="photo-browse"]'], ['click', '.dialog [data-action="report"]']], false],
  ['29-report-sent', '#/', null, [['click', '[data-action="photo"]'], ['click', '[data-action="photo-browse"]'], ['click', '.dialog [data-action="report"]'], ['type', '#report-item', 'bike tube'], ['submit', 'form[data-form="report"]']], false],
  ['30-help', '#/', null, [['click', '[data-panel="help"]']], false],
  ['31-help-search', '#/', null, [['click', '[data-panel="help"]'], ['type', '#help-q', 'drop']], false],
  ['32-call-311', '#/search?q=bike%20tube', null, [['click', '[data-action="call"]']], false],
  ['33-language', '#/', null, [['click', '[data-panel="language"]']], false],
  ['34-calendar', '#/', null, [['click', '[data-panel="calendar"]']], false],
  ['35-map', '#/', null, [['click', '[data-panel="map"]']], false],
  ['36-map-site-card', '#/', null, [['click', '[data-panel="map"]'], ['click', '.pin']], false],
  ['37-building-address', '#/', null, [['click', '[data-panel="building"]'], ['type', '#addr', '123']], false],
  ['38-building', '#/building/123-example-st-nw', null, [], true],
  ['39-building-item', '#/building/123-example-st-nw/food-scraps', null, [], true],
  ['40-building-unknown', '#/building/unknown', null, [], true],
  ['41-page-not-found', '#/item/does-not-exist', null, [], false],
];

function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
function getJSON(url) {
  return new Promise(function (res, rej) {
    http.get(url, function (r) { var d = ''; r.on('data', function (c) { d += c; }); r.on('end', function () { res(JSON.parse(d)); }); }).on('error', rej);
  });
}

(async function () {
  if (!CHROME) throw new Error('Chrome not found. Set the CHROME environment variable to its path.');
  fs.mkdirSync(OUT, { recursive: true });
  var server = spawn(process.execPath, [path.join(__dirname, 'serve.js'), String(PORT)], { stdio: 'ignore' });
  var profile = fs.mkdtempSync(path.join(os.tmpdir(), 'wgw-shots-'));
  var chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=9334', '--user-data-dir=' + profile, 'about:blank'], { stdio: 'ignore' });
  try {
    var targets;
    for (var i = 0; i < 60 && !targets; i++) { try { targets = await getJSON('http://127.0.0.1:9334/json'); } catch (e) { await sleep(250); } }
    var page = targets.filter(function (t) { return t.type === 'page'; })[0];
    var ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(function (r) { ws.onopen = r; });
    var id = 0, pending = {};
    ws.onmessage = function (m) { var d = JSON.parse(m.data); if (pending[d.id]) { pending[d.id](d); delete pending[d.id]; } };
    function send(method, params) {
      return new Promise(function (r) { var n = ++id; pending[n] = r; ws.send(JSON.stringify({ id: n, method: method, params: params || {} })); });
    }
    async function ev(expr) {
      var r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
      if (r.result && r.result.exceptionDetails) throw new Error(expr + ' -> ' + r.result.exceptionDetails.text);
      return r.result && r.result.result && r.result.result.value;
    }
    function metrics(h) { return send('Emulation.setDeviceMetricsOverride', { width: 390, height: h, deviceScaleFactor: 2, mobile: true }); }

    await metrics(844);
    var base = 'http://localhost:' + PORT + '/index.html';
    await send('Page.navigate', { url: base });
    await sleep(1200);

    for (var s = 0; s < SHOTS.length; s++) {
      var shot = SHOTS[s];
      await metrics(844);
      await ev('localStorage.clear();' + (shot[2] ? 'localStorage.setItem("wgw.v1", ' + JSON.stringify(JSON.stringify(shot[2])) + ');' : '') + '1');
      await send('Page.navigate', { url: 'about:blank' });
      await send('Page.navigate', { url: base + shot[1] });
      await sleep(1600); // let the save animation finish
      for (var k = 0; k < shot[3].length; k++) {
        var st = shot[3][k];
        var sel = JSON.stringify(st[1] || '');
        if (st[0] === 'click') await ev('(function(){var e=document.querySelector(' + sel + '); if(!e) throw new Error("missing " + ' + sel + '); e.click(); return 1})()');
        if (st[0] === 'type') await ev('(function(){var e=document.querySelector(' + sel + '); e.focus(); e.value=' + JSON.stringify(st[2]) + '; e.dispatchEvent(new Event("input",{bubbles:true})); return 1})()');
        if (st[0] === 'submit') await ev('(function(){document.querySelector(' + sel + ').requestSubmit(); return 1})()');
        if (st[0] === 'wait') await sleep(st[1]);
        await sleep(500);
      }
      if (shot[4]) {
        var h = await ev('Math.max(844, document.documentElement.scrollHeight)');
        await metrics(h);
        await sleep(300);
      }
      await ev('document.activeElement && document.activeElement.blur && !document.querySelector(".dialog") && document.activeElement.blur(); 1');
      var shotData = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(OUT, shot[0] + '.png'), Buffer.from(shotData.result.data, 'base64'));
      console.log('saved', shot[0]);
    }
    ws.close();
  } finally {
    chrome.kill();
    server.kill();
  }
})().catch(function (e) { console.error(e); process.exit(1); });
