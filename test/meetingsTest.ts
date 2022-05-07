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
  await page.click('div[role="dialog"] button:has-text("Login")');
  await page.waitForNavigation({ url: 'http://localhost:8080/meetings' });
  // Click main button
  await page.click('button > [data-testId="AddIcon"]');
  // Click text=Create MeetingNameNameDescriptionDescription0/255LocationLocationMembersMembersU >> button
  await page.click('button > [data-testId="CloseIcon"]');
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
  await page.click('div[role="dialog"] button:has-text("Login")');
  await page.waitForNavigation({ url: 'http://localhost:8080/meetings' });
  // Click main button
  await page.click('button > [data-testId="AddIcon"]');
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
  await page.click('div[role="dialog"] button:has-text("Login")');
  await page.waitForNavigation({ url: 'http://localhost:8080/meetings' });
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
  await page.click('div[role="dialog"] button:has-text("Login")');
  await page.waitForNavigation({ url: 'http://localhost:8080/meetings' });
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
  await page.click('button[title="Close"]');
  // Click text=MembersMembers >> input[type="text"]
  await page.click('text=MembersMembers >> input[type="text"]');
  // Click text=Mantas Grabauskas
  await page.click('text=Test Test');
  await page.fill(
    'label:has-text("Start Date") ~ div > input',
    '05/06/2023 01:00 pm',
  );
  await page.fill(
    'label:has-text("End Date") ~ div > input',
    '05/06/2023 02:00 pm',
  );
  // Click button:has-text("Create")
  await page.click('button:has-text("Create")');
  expect(await page.textContent('text=Meeting successfully created!')).equal(
    'Meeting successfully created!',
  );
});
