import type { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
