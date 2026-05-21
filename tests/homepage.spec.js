import {test, expect} from '@playwright/test';

test.describe('homepage tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        
    });

    test('verify homepage title', async ({ page }) => {
        await expect(page.getByText('Swag Labs')).toBeVisible(); //verify successful navigation to homepage by checking the title
    });

    test('verify inventory items are visible', async ({ page }) => {
        const inventoryItems = page.locator('.inventory_item'); //locate the inventory items on the homepage
        await expect(inventoryItems).toHaveCount(6); //verify that there are 6 inventory items displayed on the homepage
    });

    test('verify shopping cart is empty', async ({ page }) => {
        const cartBadge = page.locator('.shopping_cart_badge'); //locate the shopping cart badge element
        await expect(cartBadge).toBeHidden(); //verify that the shopping cart badge is hidden, indicating that the cart is empty
    });

    test('verify user can add item to cart', async ({ page }) => {
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click(); //click the add to cart button for the backpack item
        const cartBadge = page.locator('.shopping_cart_badge'); //locate the shopping cart badge element
        await expect(cartBadge).toHaveText('1'); //verify that the shopping cart badge now shows "1", indicating that one item has been added to the cart
    }); 
    
    
    test('verify user can navigate to cart page', async ({ page }) => {
        await page.locator('.shopping_cart_link').click(); //click the shopping cart link to navigate to the cart page
        await expect(page.getByText('Your Cart')).toBeVisible(); //verify that the cart page is displayed by checking for the presence of the "Your Cart" text
    });

    test('verify user can remove item from cart', async ({ page }) => {
        //add two items to the cart first
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

        //verify cart badge shows 2 items
        const cartBadge = page.locator('.shopping_cart_badge');
        await expect(cartBadge).toHaveText('2');

        //remove one item from the cart
        await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

        //verify cart badge now shows 1 item
        await expect(cartBadge).toHaveText('1');

        //optionally, remove the second item and verify cart is empty again
        await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
        await expect(cartBadge).toBeHidden(); //verify that the shopping cart badge is hidden again, indicating that the item has been removed and the cart is empty
    });

   test('verify menu button is clickable and shows menu options', async ({ page }) => {
        await page.locator('#react-burger-menu-btn').click(); //click the menu button
        const menuOptions = page.locator('.bm-item-list a'); //locate the menu options
        await expect(menuOptions).toHaveCount(4); //verify that there are 4 menu options displayed
        await expect(menuOptions.nth(0)).toHaveText('All Items');   //verify that the first menu option is "All Items"      
        await expect(menuOptions.nth(1)).toHaveText('About');       //verify that the second menu option is "About"
        await expect(menuOptions.nth(2)).toHaveText('Logout');      //verify that the third menu option is "Logout"
        await expect(menuOptions.nth(3)).toHaveText('Reset App State'); //verify that the fourth menu option is "Reset App State"
    });

    test('verify clicking on product name navigates to product details page',async({page})=>{
        await page.locator('.inventory_item_name').first().click(); //click on the first product name in the inventory list
        await expect(page.getByText('Sauce Labs Backpack')).toBeVisible(); //verify that the product details page is displayed by checking for the presence of the product name text  
        
        //verify that the product description is visible on the product details page
        await expect(page.getByText('carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.')).toBeVisible(); 
    });

    test('verify user can back to homepage from product details page', async ({ page }) => {
        await page.locator('.inventory_item_name').first().click(); //click on the first product name in the inventory list to navigate to the product details page
        await page.locator('#back-to-products').click(); //click the back to products button to navigate back to the homepage
        await expect(page.getByText('Swag Labs')).toBeVisible(); //verify that the homepage is displayed again by checking for the presence of the title text
    });

    test('verify user can logout from the menu', async ({ page }) => {
        await page.locator('#react-burger-menu-btn').click(); //click the menu button to open the menu
        await page.locator('.bm-item-list a').nth(2).click();   //click the third menu option which is "Logout"
        await expect(page.locator('[data-test="login-button"]')).toBeVisible(); //verify that the user is logged out and back on the login page by checking for the presence of the login button
    });

});