import { type Locator, type Page, expect } from '@playwright/test';

/** Converts a product name to its data-test slug, e.g. "Sauce Labs Backpack" -> "sauce-labs-backpack". */
const slug = (name: string): string => name.toLowerCase().replace(/\s+/g, '-');

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sort: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.sort = page.getByTestId('product-sort-container');
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  async addToCart(product: string): Promise<void> {
    await this.page.getByTestId(`add-to-cart-${slug(product)}`).click();
  }

  async removeFromCart(product: string): Promise<void> {
    await this.page.getByTestId(`remove-${slug(product)}`).click();
  }

  async prices(): Promise<number[]> {
    const texts = await this.page.getByTestId('inventory-item-price').allTextContents();
    return texts.map((t) => Number(t.replace('$', '')));
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.title).toHaveText('Products');
  }
}
