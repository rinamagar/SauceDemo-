import {test,expect} from '@playwright/test';
test.describe('checkout tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');  
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('.shopping_cart_link').click();
        
    });

    test('verify your cart page displays correct item', async ({ page }) => {
        const cartItem = page.locator('.cart_item'); //locate the cart item element on the checkout page
        await expect(cartItem).toBeVisible(); //verify that the cart item is visible on the checkout page

        // Locate the item name inside the cart
        const itemName = cartItem.locator('.inventory_item_name');
        await expect(itemName).toHaveText('Sauce Labs Backpack');
    });

    test('verify user can enter checkout information', async ({ page }) => {
        await page.locator('[data-test="checkout"]').click();
        await page.locator('[data-test="firstName"]').fill('John'); 
        await page.locator('[data-test="lastName"]').fill('Doe');
        await page.locator('[data-test="postalCode"]').fill('12345');
        await page.locator('[data-test="continue"]').click(); //click the continue button to proceed to the next step of the checkout process
        await expect(page.getByText('Checkout: Overview')).toBeVisible(); //verify that the user has successfully navigated to the checkout overview page by checking for the presence of the "Checkout: Overview" text
    });

    test('verify user can complete checkout process', async ({ page }) => {
        await page.locator('[data-test="checkout"]').click();
        await page.locator('[data-test="firstName"]').fill('John'); 
        await page.locator('[data-test="lastName"]').fill('Doe');
        await page.locator('[data-test="postalCode"]').fill('12345');
        await page.locator('[data-test="continue"]').click();
        await page.locator('[data-test="finish"]').click(); //click the finish button to complete the checkout process
        await expect(page.getByText('Checkout: Complete!')).toBeVisible(); //verify that the checkout process is complete by checking for the presence of the "Checkout: Complete!" text
    });

    test ('verify error message is shown when checkout information is incomplete', async ({ page }) => {
        await page.locator('[data-test="checkout"]').click();
        await page.locator('[data-test="firstName"]').fill('');     
        await page.locator('[data-test="lastName"]').fill('');
        await page.locator('[data-test="postalCode"]').fill('');
        await page.locator('[data-test="continue"]').click();
        await expect(page.getByText('Error: First Name is required')).toBeVisible(); //verify that an error message is displayed when the user tries to continue without filling in the required checkout information
    });
    
    test('verify user can navigate back to cart from checkout page', async ({ page }) => {
        await page.locator('[data-test="checkout"]').click();
        await page.locator('[data-test="cancel"]').click(); //click the cancel button to navigate back to the cart page
        await expect(page.getByText('Your Cart')).toBeVisible(); //verify that the user has successfully navigated back to the cart page by checking for the presence of the "Your Cart" text
    });

    test('verify user can navigate back to homepage from checkout page', async ({ page }) => {
        await page.locator('#react-burger-menu-btn').click(); //click the menu button to open the navigation menu
        await page.locator('#inventory_sidebar_link').click(); //click the "All Items" link in the navigation menu to navigate back to the homepage
        await expect(page.getByText('Swag Labs')).toBeVisible(); //verify that the user has successfully navigated back to the homepage by checking for the presence of the "Swag Labs" text
    });


});