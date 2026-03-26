import { type Page, type Locator } from "@playwright/test";

export class CartPage {
  private cartItems: Locator;

  constructor(private page: Page) {
    this.cartItems = page.locator(".cart_item");
  }

  async getCartItemDetails(productName: string) {
    const item = this.cartItems.filter({ hasText: productName });

    const name = await item.locator(".inventory_item_name").textContent();
    const price = await item.locator(".inventory_item_price").textContent();

    return { name: name!, price: price! };
  }

  async checkout() {
    await this.page.locator('[data-test="checkout"]').click();
  }
}
