import { type Locator, type Page, expect } from '@playwright/test';

export class InventoryPage {
  readonly sort: Locator;
  readonly cart: Locator;
  /** Prices are plain text with no role or label, so a test id is the only stable hook. */
  readonly prices: Locator;

  constructor(private readonly page: Page) {
    this.sort = page.getByRole('combobox', { name: 'Sort products' });
    this.cart = page.getByRole('button', { name: /^Cart,/ });
    this.prices = page.getByTestId('inventory-item-price');
  }

  /**
   * Product cards have no list or article role, so they look identical to
   * assistive technology; the test id scopes actions to one card.
   */
  product(name: string): Locator {
    return this.page.getByTestId('inventory-item').filter({ has: this.page.getByRole('button', { name: `View details for ${name}` }) });
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  async addToCart(name: string): Promise<void> {
    await this.product(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(name: string): Promise<void> {
    await this.product(name).getByRole('button', { name: 'Remove' }).click();
  }

  async priceValues(): Promise<number[]> {
    const texts = await this.prices.allTextContents();
    return texts.map((t) => Number(t.replace('$', '')));
  }

  async openCart(): Promise<void> {
    await this.cart.click();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.sort).toBeVisible();
  }
}
