const { chromium } = require('C:/Users/a1345/.dsh/profiles/desktop/node_modules/playwright');
const path = require('path');
(async () => {
  const file = process.argv[2];
  const out = process.argv[3];
  const dsf = parseFloat(process.argv[4] || '2');
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 }, deviceScaleFactor: dsf });
  await page.goto('file:///' + file.replace(/\\/g, '/'), { waitUntil: 'load' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: out, fullPage: true });
  const box = await page.evaluate(() => ({ w: document.body.scrollWidth, h: document.body.scrollHeight }));
  console.log('css-size', JSON.stringify(box), 'dsf', dsf);
  await browser.close();
})();
