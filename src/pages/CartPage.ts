import type { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.itemNames = page.getByRole('button', { name: /^View details for / });
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
