import { test, expect } from '@fixtures/index';
import { CHECKOUT_INFO } from '@data/users';

const BACKPACK = 'Sauce Labs Backpack';
const BIKE_LIGHT = 'Sauce Labs Bike Light';

test.describe('Cart and checkout (pre-authenticated via storageState)', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.expectLoaded();
  });

  test('adding and removing items updates the cart count', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(BACKPACK);
    await inventoryPage.addToCart(BIKE_LIGHT);
    await expect(inventoryPage.cart).toHaveAccessibleName('Cart, 2 items');
    await inventoryPage.removeFromCart(BACKPACK);
    await expect(inventoryPage.cart).toHaveAccessibleName('Cart, 1 items');
  });

  test('cart lists the selected products', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(BACKPACK);
    await inventoryPage.addToCart(BIKE_LIGHT);
    await inventoryPage.openCart();
    await expect(cartPage.itemNames).toHaveText([BACKPACK, BIKE_LIGHT]);
  });

  test('products can be sorted by price ascending', async ({ inventoryPage }) => {
    await inventoryPage.sort.selectOption('lohi');
    await expect(async () => {
      const prices = await inventoryPage.priceValues();
      expect(prices.length).toBeGreaterThan(1);
      expect(prices).toEqual([...prices].sort((a, b) => a - b));
    }).toPass({ timeout: 5_000 });
  });

  test.describe('checkout with one item in the cart', () => {
    test.beforeEach(async ({ inventoryPage, cartPage }) => {
      await inventoryPage.addToCart(BACKPACK);
      await inventoryPage.openCart();
      await cartPage.checkout();
    });

    test('completes an end-to-end purchase', async ({ checkoutPage }) => {
      await checkoutPage.fillInfo(CHECKOUT_INFO);
      await checkoutPage.finish();
      await expect(checkoutPage.confirmation).toBeVisible();
    });

    test('requires first name', async ({ checkoutPage }) => {
      await checkoutPage.fillInfo({ lastName: CHECKOUT_INFO.lastName, postalCode: CHECKOUT_INFO.postalCode });
      await expect(checkoutPage.error).toContainText('First Name is required');
    });

    test('requires postal code', async ({ checkoutPage }) => {
      await checkoutPage.fillInfo({ firstName: CHECKOUT_INFO.firstName, lastName: CHECKOUT_INFO.lastName });
      await expect(checkoutPage.error).toContainText('Postal Code is required');
    });
  });
});
