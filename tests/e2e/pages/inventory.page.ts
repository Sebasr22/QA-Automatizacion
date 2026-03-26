import { type Page, type Locator } from "@playwright/test";

export class InventoryPage {
  private inventoryItems: Locator;

  constructor(private page: Page) {
    this.inventoryItems = page.locator(".inventory_item");
  }

  async getProductByName(productName: string) {
    const item = this.inventoryItems.filter({
      hasText: productName,
    });

    const name = await item.locator(".inventory_item_name").textContent();
    const price = await item.locator(".inventory_item_price").textContent();

    return { name: name!, price: price! };
  }

  async addProductToCart(productName: string) {
    const item = this.inventoryItems.filter({
      hasText: productName,
    });
    await item.locator("button", { hasText: "Add to cart" }).click();
  }

  async goToCart() {
    await this.page.locator(".shopping_cart_link").click();
  }
}
