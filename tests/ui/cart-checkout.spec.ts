import { test, expect } from '@fixtures/index';
import { CHECKOUT_INFO } from '@data/users';

const BACKPACK = 'Sauce Labs Backpack';
const BIKE_LIGHT = 'Sauce Labs Bike Light';

test.describe('Cart and checkout (pre-authenticated via storageState)', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.expectLoaded();
  });

  test('adding and removing items updates the cart badge', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(BACKPACK);
    await inventoryPage.addToCart(BIKE_LIGHT);
    await expect(inventoryPage.cartBadge).toHaveText('2');
    await inventoryPage.removeFromCart(BACKPACK);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('cart lists the selected products', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(BACKPACK);
    await inventoryPage.addToCart(BIKE_LIGHT);
    await inventoryPage.openCart();
    await cartPage.expectProducts([BACKPACK, BIKE_LIGHT]);
  });

  test('completes an end-to-end purchase', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart(BACKPACK);
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInfo(CHECKOUT_INFO);
    await checkoutPage.finish();
    await checkoutPage.expectOrderComplete();
  });

  test('checkout requires first name', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart(BACKPACK);
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInfo({ lastName: CHECKOUT_INFO.lastName, postalCode: CHECKOUT_INFO.postalCode });
    await expect(checkoutPage.error).toContainText('First Name is required');
  });

  test('checkout requires postal code', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart(BACKPACK);
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInfo({ firstName: CHECKOUT_INFO.firstName, lastName: CHECKOUT_INFO.lastName });
    await expect(checkoutPage.error).toContainText('Postal Code is required');
  });

  test('products can be sorted by price ascending', async ({ inventoryPage }) => {
    await inventoryPage.sort.selectOption('lohi');
    await expect.poll(async () => {
      const prices = await inventoryPage.prices();
      return prices.length > 1 && prices.every((p, i) => i === 0 || p >= prices[i - 1]!);
    }).toBe(true);
  });
});
