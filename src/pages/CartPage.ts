import { type Locator, type Page, expect } from '@playwright/test';

export class CartPage {
  readonly items: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.items = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async expectProducts(names: string[]): Promise<void> {
    await expect(this.page.getByTestId('inventory-item-name')).toHaveText(names);
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
