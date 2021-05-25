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
    page.waitForNavigation(/*{ url: 'http://localhost:8080/meetings' }*/),
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
  expect(await page.textContent('input[name="password"]')).equal('Password1');
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

// 10.1
it('user wants to close new meeting creation window', async () => {
  // Go to http://localhost:8080/
  await page.goto('http://localhost:8080/');
  // Click button:has-text("Login")
  await page.click('button:has-text("Login")');
  // Click input[name="email"]
  await page.click('input[name="email"]');
  // Fill input[name="email"]
  await page.fill('input[name="email"]', 'test@test.com');
  // Press Tab
  await page.press('input[name="email"]', 'Tab');
  // Fill input[name="password"]
  await page.fill('input[name="password"]', 'Password1');
  // Press Enter
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8080/meetings' }*/),
    page.press('input[name="password"]', 'Enter'),
  ]);
  // Click main button
  await page.click('main button');
  // Click text=Create MeetingNameNameDescriptionDescription0/255LocationLocationMembersMembersU >> button
  await page.click(
    'text=Create MeetingNameNameDescriptionDescription0/255LocationLocationMembersMembersU >> button',
  );
});

// 10.2
it('user wants to create meeting without any information', async () => {
  // Go to http://localhost:8080/
  await page.goto('http://localhost:8080/');
  // Click button:has-text("Login")
  await page.click('button:has-text("Login")');
  // Click input[name="email"]
  await page.click('input[name="email"]');
  // Fill input[name="email"]
  await page.fill('input[name="email"]', 'test@test.com');
  // Press Tab
  await page.press('input[name="email"]', 'Tab');
  // Fill input[name="password"]
  await page.fill('input[name="password"]', 'Password1');
  // Press Enter
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8080/meetings' }*/),
    page.press('input[name="password"]', 'Enter'),
  ]);
  // Click main button
  await page.click('main button');
  // Click button:has-text("Create")
  await page.click('button:has-text("Create")');
  expect(await page.textContent('text = Required')).equal('Required');
  expect(await page.textContent('text=Select at least one member')).equal(
    'Select at least one member',
  );
  expect(
    await page.textContent('text=End date must be after start date'),
  ).equal('End date must be after start date');
});

// 10.3
it('user wants to create meeting with invalid information', async () => {
  // Go to http://localhost:8080/
  await page.goto('http://localhost:8080/');
  // Click button:has-text("Login")
  await page.click('button:has-text("Login")');
  // Click input[name="email"]
  await page.click('input[name="email"]');
  // Fill input[name="email"]
  await page.fill('input[name="email"]', 'test@test.com');
  // Press Tab
  await page.press('input[name="email"]', 'Tab');
  // Fill input[name="password"]
  await page.fill('input[name="password"]', 'Password1');
  // Press Enter
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8080/meetings' }*/),
    page.press('input[name="password"]', 'Enter'),
  ]);
  // Click main button
  await page.click('main button');
  // Click input[name="meetingName"]
  await page.click('input[name="meetingName"]');
  // Fill input[name="meetingName"]
  await page.fill('input[name="meetingName"]', 'Name');
  // Press Tab
  await page.press('input[name="meetingName"]', 'Tab');
  // Fill textarea[name="description"]
  await page.fill('textarea[name="description"]', 'Description');
  // Click div[role="dialog"] div:has-text("NameNameDescriptionDescription11/255LocationLocationMembersMembersUse Dates Poll")
  await page.click(
    'div[role="dialog"] div:has-text("NameNameDescriptionDescription11/255LocationLocationMembersMembersUse Dates Poll")',
  );
  // Click button:has-text("Create")
  await page.click('button:has-text("Create")');
  expect(await page.textContent('text=Select at least one member')).equal(
    'Select at least one member',
  );
  expect(
    await page.textContent('text=End date must be after start date'),
  ).equal('End date must be after start date');
});

// 10.4
it('user wants to create meeting with valid information', async () => {
  // Go to http://localhost:8080/
  await page.goto('http://localhost:8080/');
  // Click button:has-text("Login")
  await page.click('button:has-text("Login")');
  // Click input[name="email"]
  await page.click('input[name="email"]');
  // Fill input[name="email"]
  await page.fill('input[name="email"]', 'test@test.com');
  // Press Tab
  await page.press('input[name="email"]', 'Tab');
  // Fill input[name="password"]
  await page.fill('input[name="password"]', 'Password1');
  // Press Enter
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8080/meetings' }*/),
    page.press('input[name="password"]', 'Enter'),
  ]);
  // Click main button
  await page.click('main button');
  // Click input[name="meetingName"]
  await page.click('input[name="meetingName"]');
  // Fill input[name="meetingName"]
  await page.fill('input[name="meetingName"]', 'Name');
  // Click textarea[name="description"]
  await page.click('textarea[name="description"]');
  // Fill textarea[name="description"]
  await page.fill('textarea[name="description"]', 'Description');
  // Click text=LocationLocation >> input[type="text"]
  await page.click('text=LocationLocation >> input[type="text"]');
  // Fill text=LocationLocation >> input[type="text"]
  await page.fill('text=LocationLocation >> input[type="text"]', 'kaunas');
  // Click text=KaunasLithuania
  await page.click('text=KaunasLithuania');
  // Click text=MembersMembers >> input[type="text"]
  await page.click('text=MembersMembers >> input[type="text"]');
  // Click text=Mantas Grabauskas
  await page.click('text=Vardenis Pavardenis');
  // Click input[name="dates.0.startDate"]
  await page.click('input[name="dates.0.startDate"]');
  // Click :nth-match(button:has-text("9"), 2)
  await page.click(':nth-match(button:has-text("9"), 2)');
  // Click button:has-text("OK")
  await page.click('button:has-text("OK")');
  // Click input[name="dates.0.endDate"]
  await page.click('input[name="dates.0.endDate"]');
  // Click button:has-text("11")
  await page.click('button:has-text("11")');
  // Click button:has-text("OK")
  await page.click('button:has-text("OK")');
  // Click button:has-text("Create")
  await page.click('button:has-text("Create")');
  expect(await page.textContent('text=Meeting successfully created!')).equal(
    'Meeting successfully created!',
  );
});
