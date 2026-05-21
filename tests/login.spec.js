import { test, expect } from '@playwright/test';

test.describe('login functionality', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test('valid login', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.getByText('Swag Labs')).toBeVisible();
  });

  test('invalid username', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('invalid_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.getByText('Epic sadface')).toBeVisible();
  });

  test('invalid password', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('invalid_password');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.getByText('Epic sadface: Username and password do not match any user in this service')).toBeVisible();
  });

  test('empty fields', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('');
    await page.locator('[data-test="password"]').fill('');
    await page.locator('[data-test="login-button"]').click();
    // await expect(page.locator('[data-test="error"]')).toBeVisible();
      await expect(page.getByText('Epic sadface: Username is required')).toBeVisible();
  });

  test('verify locked out user cannot login', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.getByText('Epic sadface: Sorry, this user has been locked out')).toBeVisible();
  });
  
  test('verify problem user can login but has issues', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('problem_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.getByText('Swag Labs')).toBeVisible();
    // Verify that the problem user sees a broken (404) image for the backpack item
    const images = await page.getByRole('img', { name: 'Sauce Labs Backpack' });
    await expect(images).toHaveCount(1);
    await expect(images).toHaveAttribute('src', '/static/media/sl-404.168b1cce10384b857a6f.jpg');
  });

  test('verify performance glitch user can login but has performance issues', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('performance_glitch_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');  

     // Verify that the performance glitch user experiences a delay in loading the inventory page
    const startTime = Date.now(); //start timing before waiting for the inventory container to load
    await page.locator('[data-test="login-button"]').click();
    
    await page.waitForSelector('.inventory_container '); 
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    console.log(`Performance Glitch User load time: ${loadTime} ms`);
    console.log(`startTime:${startTime} & endTime:${endTime} ms`);

    // Assert that the load time is greater than a certain threshold (e.g., 2000 ms)
    expect(loadTime).toBeGreaterThan(2000);
    //also verify the page eventually loads successfully
    await expect(page.getByText('Swag Labs')).toBeVisible();
  }); 
  test('verify password is masked',async({page})=>{
    await page.locator('[data-test="username"]').fill('standard_user');
    const passwordInput = page.locator('[data-test="password"]');
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('verify logout button functionality', async ({ page }) => {
    // use data-test selectors for more reliable targeting
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.getByText('Swag Labs')).toBeVisible();
    await page.locator('button:has-text("Open Menu")').click();
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.locator('[data-test="login-button"]')).toBeVisible(); // verify back on login page after logout
  });
    
});  

