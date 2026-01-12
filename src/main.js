import { renderProducts } from "./products.js";
import { initCart } from "./cart.js";
import "./style.css";

function initApp() {
  const elements = {
    productsGrid: document.getElementById("products-grid"),
    basketLink: document.getElementById("basket-link"),
    basketCount: document.getElementById("basket-count"),
    cartModal: document.getElementById("cart-modal"),
    cartItemsContainer: document.getElementById("cart-items"),
    cartTotal: document.getElementById("cart-total"),
    cartEmpty: document.getElementById("cart-empty"),
    clearCartBtn: document.getElementById("clear-cart"),
    orderBtn: document.getElementById("order-btn"),
    closeModal: document.getElementById("close-modal"),
    closeSuccess: document.getElementById("close-success"),
    successModal: document.getElementById("order-success-modal"),
    continueShopping: document.getElementById("continue-shopping"),
    modalActions: document.getElementById("modal-actions"),
  };

  const cart = initCart(elements);
  renderProducts(elements.productsGrid, cart);

  elements.basketLink.addEventListener("click", (e) => {
    e.preventDefault();
    cart.renderCartModal();
    elements.cartModal.showModal();
  });

  elements.closeModal.addEventListener("click", () => {
    elements.cartModal.close();
  });

  elements.closeSuccess.addEventListener("click", () => {
    elements.successModal.close();
  });

  elements.clearCartBtn.addEventListener("click", () => {
    cart.clearCart();
  });

  elements.orderBtn.addEventListener("click", () => {
    if (cart.getItems().length === 0) return;
    elements.cartModal.close();
    elements.successModal.showModal();
    setTimeout(() => cart.clearCart(), 1000);
  });

  elements.continueShopping.addEventListener("click", () => {
    elements.cartModal.close();
  });

  window.addEventListener("click", (e) => {
    if (e.target === elements.cartModal) elements.cartModal.close();
    if (e.target === elements.successModal) elements.successModal.close();
  });
}

document.addEventListener("DOMContentLoaded", initApp);
