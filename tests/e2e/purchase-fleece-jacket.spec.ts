import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/login.page";
import { InventoryPage } from "./pages/inventory.page";
import { CartPage } from "./pages/cart.page";
import { CheckoutPage } from "./pages/checkout.page";

const PRODUCT_NAME = "Sauce Labs Fleece Jacket";

test("compra completa de Sauce Labs Fleece Jacket", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  // Login con credenciales de la pagina
  await loginPage.goto();
  await loginPage.login("standard_user", "secret_sauce");

  // Capturar nombre y precio del producto en inventario
  const productInfo = await inventoryPage.getProductByName(PRODUCT_NAME);
  expect(productInfo.name).toBe(PRODUCT_NAME);

  // Agregar al carrito y navegar al carrito
  await inventoryPage.addProductToCart(PRODUCT_NAME);
  await inventoryPage.goToCart();

  // Validar que nombre y precio en el carrito coincidan
  const cartInfo = await cartPage.getCartItemDetails(PRODUCT_NAME);
  expect(cartInfo.name).toBe(productInfo.name);
  expect(cartInfo.price).toBe(productInfo.price);

  // Completar checkout
  await cartPage.checkout();
  await checkoutPage.fillShippingInfo("Test", "User", "12345");
  await checkoutPage.finishOrder();

  // Verificar confirmacion de orden
  await expect(checkoutPage.confirmationMessage).toHaveText("Thank you for your order!");
});
