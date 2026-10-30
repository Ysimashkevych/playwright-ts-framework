import type { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly error: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.error = page.getByTestId('error');
    this.completeHeader = page.getByTestId('complete-header');
  }

  async fillInfo(info: { firstName?: string; lastName?: string; postalCode?: string }): Promise<void> {
    if (info.firstName) await this.firstName.fill(info.firstName);
    if (info.lastName) await this.lastName.fill(info.lastName);
    if (info.postalCode) await this.postalCode.fill(info.postalCode);
    await this.continueButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
