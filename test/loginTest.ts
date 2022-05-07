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
  expect(await page.textContent('span:has-text("Login")')).equal('Login');
});

// 2.1
it('close Login', async () => {
  // Go to http://localhost:8080/
  await page.goto('http://localhost:8080/');
  // Click button:has-text("Login")
  await page.click('button:has-text("Login")');
  // Click text=LoginEmailPasswordLoginNot a member? Register >> button
  await page.click(
    'text=LoginEmailPasswordLoginNot a member? Register >> button',
  );
});

// 2.2
it('login without any information provided', async () => {
  // Go to http://localhost:8080/
  await page.goto('http://localhost:8080/');
  // Click button:has-text("Login")
  await page.click('button:has-text("Login")');
  // Click div[role="dialog"] button:has-text("Login")
  await page.click('div[role="dialog"] button:has-text("Login")');
  expect(await page.textContent('text=Required')).equal('Required');
  expect(await page.textContent('#password-error-text')).equal('Required');
});

// 2.3
it('login without email', async () => {
  // Go to http://localhost:8080/
  await page.goto('http://localhost:8080/');
  // Click button:has-text("Login")
  await page.click('button:has-text("Login")');
  // Click input[name="password"]
  await page.click('input[name="password"]');
  // Fill input[name="password"]
  await page.fill('input[name="password"]', 'Password1');
  // Click div[role="dialog"] button:has-text("Login")
  await page.click('div[role="dialog"] button:has-text("Login")');
  expect(await page.textContent('text=Required')).equal('Required');
});

// 2.4
it('login without password', async () => {
  // Go to http://localhost:8080/
  await page.goto('http://localhost:8080/');
  // Click button:has-text("Login")
  await page.click('button:has-text("Login")');
  // Click input[name="email"]
  await page.click('input[name="email"]');
  // Fill input[name="email"]
  await page.fill('input[name="email"]', 'test@test.com');
  // Click div[role="dialog"] button:has-text("Login")
  await page.click('div[role="dialog"] button:has-text("Login")');
  expect(await page.textContent('#password-error-text')).equal('Required');
});

// 2.5
it('login with invalid email', async () => {
  // Go to http://localhost:8080/
  await page.goto('http://localhost:8080/');
  // Click button:has-text("Login")
  await page.click('button:has-text("Login")');
  // Click input[name="email"]
  await page.click('input[name="email"]');
  // Fill input[name="email"]
  await page.fill('input[name="email"]', 'test');
  // Click input[name="password"]
  await page.click('input[name="password"]');
  // Fill input[name="password"]
  await page.fill('input[name="password"]', 'Password1');
  // Click div[role="dialog"] button:has-text("Login")
  await page.click('div[role="dialog"] button:has-text("Login")');
  expect(await page.textContent('text=That is not a valid email')).equal(
    'That is not a valid email',
  );
});

// 2.6
it('login with invalid password', async () => {
  // Go to http://localhost:8080/
  await page.goto('http://localhost:8080/');
  // Click button:has-text("Login")
  await page.click('button:has-text("Login")');
  // Click input[name="email"]
  await page.click('input[name="email"]');
  // Fill input[name="email"]
  await page.fill('input[name="email"]', 'test@test.com');
  // Click input[name="password"]
  await page.click('input[name="password"]');
  // Fill input[name="password"]
  await page.fill('input[name="password"]', 'p');
  // Click div[role="dialog"] button:has-text("Login")
  await page.click('div[role="dialog"] button:has-text("Login")');
  expect(await page.textContent('text=Invalid credentials.')).equal(
    'Invalid credentials.',
  );
});

// 2.7
it('login without a register account', async () => {
  // Go to http://localhost:8080/
  await page.goto('http://localhost:8080/');
  // Click button:has-text("Login")
  await page.click('button:has-text("Login")');
  // Click input[name="email"]
  await page.click('input[name="email"]');
  // Fill input[name="email"]
  await page.fill('input[name="email"]', 'newTest@test.com');
  // Click input[name="password"]
  await page.click('input[name="password"]');
  // Fill input[name="password"]
  await page.fill('input[name="password"]', 'Password1');
  // Click div[role="dialog"] button:has-text("Login")
  await page.click('div[role="dialog"] button:has-text("Login")');
  expect(await page.textContent('text=Invalid credentials.')).equal(
    'Invalid credentials.',
  );
});

// 2.8
it('login with existing account information', async () => {
  // Go to http://localhost:8080/
  await page.goto('http://localhost:8080/');
  // Click button:has-text("Login")
  await page.click('button:has-text("Login")');
  // Click input[name="email"]
  await page.click('input[name="email"]');
  // Fill input[name="email"]
  await page.fill('input[name="email"]', 'test@test.com');
  // Click input[name="password"]
  await page.click('input[name="password"]');
  // Fill input[name="password"]
  await page.fill('input[name="password"]', 'Password1');
  // Click div[role="dialog"] button:has-text("Login")
  await Promise.all([
    page.waitForNavigation(/* { url: 'http://localhost:8080/meetings' }*/),
    page.click('div[role="dialog"] button:has-text("Login")'),
  ]);
  // Click button:has-text("BP")
  await page.click('button:has-text("TT")');
  expect(await page.textContent('text=test@test.com')).equal('test@test.com');
});

// 2.9 !!!!!!
it('user wants to view password', async () => {
  // Go to http://localhost:8080/
  await page.goto('http://localhost:8080/');
  // Click button:has-text("Login")
  await page.click('button:has-text("Login")');
  // Click input[name="password"]
  await page.click('input[name="password"]');
  // Fill input[name="password"]
  await page.fill('input[name="password"]', 'Password1');
  // Click #passwordVisibilityButton
  await page.click('#passwordVisibilityButton');
  expect(await page.inputValue('input[name="password"]')).equal('Password1');
});

// 2.10
it('user wants to hide password', async () => {
  // Go to http://localhost:8080/
  await page.goto('http://localhost:8080/');
  // Click button:has-text("Login")
  await page.click('button:has-text("Login")');
  // Click input[name="password"]
  await page.click('input[name="password"]');
  // Fill input[name="password"]
  await page.fill('input[name="password"]', 'Pasword1');
  // Click #passwordVisibilityButton
  await page.click('#passwordVisibilityButton');
  expect(await page.textContent('input[name="password"]')).not.equal(
    'Password1',
  );
});

// 2.11
it('user wants to register', async () => {
  // Go to http://localhost:8080/
  await page.goto('http://localhost:8080/');
  // Click button:has-text("Login")
  await page.click('button:has-text("Login")');
  // Click text=Register
  await page.click('text=Register');
  expect(await page.textContent('text=Register')).equal('Register');
});
