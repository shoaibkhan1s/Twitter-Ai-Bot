// backend/utils/mageImageFetcher.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const generateImagePrompt = require('./promptMaker'); // Assuming you have a prompt generator

const USER_DATA_DIR = path.resolve(__dirname, '../../puppeteer-user-data');
const COOKIES_PATH = path.resolve(__dirname, '../../cookies.json');
const LOGIN_WAIT_TIME_MS = 5*1000; // 5 sec

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(filepath, () => reject(err));
    });
  });
}

async function generateImageFromMageSpace(ImagePrompt) {
    const prompt = await ImagePrompt;
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    userDataDir: USER_DATA_DIR,
    timeout: 0,
  });

  const page = await browser.newPage();
  await page.goto('https://www.mage.space/', { waitUntil: 'networkidle2', timeout: 0 });

  // Check login
  const isLoggedIn = await page.evaluate(() =>
    !!document.querySelector('a[href*="/profile"]') || document.body.innerText.includes('Log out')
  );

  if (!isLoggedIn) {
    console.log('🔐 Please login manually in the opened browser. ');
    await new Promise(resolve => setTimeout(resolve, LOGIN_WAIT_TIME_MS));

    const cookies = await page.cookies();
    fs.writeFileSync(COOKIES_PATH, JSON.stringify(cookies, null, 2));
    console.log('✅ Login cookies saved!');
  } else {
    console.log('✅ Already logged in!');
  }

  await page.reload({ waitUntil: 'networkidle2', timeout: 0 });

  // Prompt submission
 // Wait for prompt input properly
await page.waitForSelector('textarea[placeholder="Describe to generate..."]');
// Clear old prompt
await page.$eval('textarea[placeholder="Describe to generate..."]', el => el.value = '');
await page.type('textarea[placeholder="Describe to generate..."]', prompt);
await page.keyboard.press('Enter');
console.log('🧠 Prompt submitted:', prompt);


  // Wait for image generation
  await new Promise(resolve => setTimeout(resolve, 120000)); // 2 mins

  // Fetch image
  const imageElement = await page.waitForSelector('img[alt="Mage media"]', { timeout: 0 });
  const imageUrl = await imageElement.evaluate(img => img.src);

  const imagePath = path.join(__dirname, `../../generated${Date.now()}.png`);
  await downloadImage(imageUrl, imagePath);

  console.log('✅ Image downloaded to', imagePath);

  await browser.close();
}

// Run the function with a prompt
generateImageFromMageSpace(generateImagePrompt())
  .then(() => console.log('🎯 Done'))
  .catch(err => console.error('❌ Error:', err));

module.exports = generateImageFromMageSpace;
