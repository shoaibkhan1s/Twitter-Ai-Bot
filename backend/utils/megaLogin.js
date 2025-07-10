// mageLoginSaver.js
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // 🔁 Your real Chrome path
    defaultViewport: null,
    args: ['--start-maximized'],
    timeout: 0
  });

  const page = await browser.newPage();
  await page.goto('https://www.mage.space/', { waitUntil: 'networkidle2', timeout: 0 });

  console.log('🔐 Please login manually (Google login popup). You have 2 minutes...');
  await new Promise(resolve => setTimeout(resolve, 120000)); // wait 2 minutes

  const cookies = await page.cookies();
  fs.writeFileSync('./cookies.json', JSON.stringify(cookies, null, 2));
  console.log('✅ Cookies saved.');

  await browser.close();
})();
