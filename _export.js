// 把一屏版 HTML 导出成高清 PNG（用于 README 里的架构图）
// 依赖：npm i -D playwright && npx playwright install chromium
// 用法：node _export.js <输入.html> <输出.png> [deviceScaleFactor=2]

const path = require('path');
const { chromium } = require('playwright');

const [input, output, dsfArg] = process.argv.slice(2);
if (!input || !output) {
  console.error('用法: node _export.js <输入.html> <输出.png> [deviceScaleFactor]');
  process.exit(1);
}
const dsf = Number(dsfArg || 2);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1600, height: 1200 },
    deviceScaleFactor: dsf,
  });
  await page.goto('file://' + path.resolve(input), { waitUntil: 'load' });
  await page.waitForTimeout(600); // 等字体与布局稳定
  const box = await page.evaluate(() => {
    const d = document.documentElement;
    return { w: d.scrollWidth, h: d.scrollHeight };
  });
  console.log('css-size', JSON.stringify(box), 'dsf', dsf);
  await page.screenshot({ path: output, fullPage: true });
  await browser.close();
})();
