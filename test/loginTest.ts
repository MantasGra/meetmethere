import { expect } from 'chai';
import { chromium, Browser, Page, BrowserContext } from 'playwright';
let browser: Browser;
before(async () => {
  browser = await chromium.launch();
});
after(async () => {
  await browser.close();
});
let context: BrowserContext;
let page: Page;
beforeEach(async () => {
  context = await browser.newContext();
  page = await context.newPage();
});
afterEach(async () => {
  await page.close();
  await context.close();
});

// 1.1
it('open App', async () => {
  // Go to http://localhost:8080/
  await page.goto('http://localhost:8080/');
  expect(await page.textContent('text=MeetMeThere')).equal('MeetMeThere');
});

// 1.2
it('open Login', async () => {
  // Go to http://localhost:8080/
  await page.goto('http://localhost:8080/');
  // Click button:has-text("Login")
  await page.click('button:has-text("Login")');
  expect(await page.textContent('h6:has-text("Login")')).equal('Login');
});
