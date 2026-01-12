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

  // Проверка наличия всех элементов
  Object.keys(elements).forEach(key => {
    if (!elements[key]) {
      console.error(`Element ${key} not found`);
    }
  });

  const cart = initCart(elements);
  renderProducts(elements.productsGrid, cart);

  // Обработчики событий
  if (elements.basketLink) {
    elements.basketLink.addEventListener("click", (e) => {
      e.preventDefault();
      cart.renderCartModal();
      elements.cartModal.showModal();
    });
  }

  if (elements.closeModal) {
    elements.closeModal.addEventListener("click", () => {
      elements.cartModal.close();
    });
  }

  if (elements.closeSuccess) {
    elements.closeSuccess.addEventListener("click", () => {
      elements.successModal.close();
    });
  }

  if (elements.clearCartBtn) {
    elements.clearCartBtn.addEventListener("click", () => {
      if (confirm("Очистить всю корзину?")) {
        cart.clearCart();
      }
    });
  }

  if (elements.orderBtn) {
    elements.orderBtn.addEventListener("click", () => {
      if (cart.getItems().length === 0) return;
      elements.cartModal.close();
      elements.successModal.showModal();
      setTimeout(() => {
        cart.clearCart();
        elements.successModal.close();
      }, 2000);
    });
  }

  if (elements.continueShopping) {
    elements.continueShopping.addEventListener("click", () => {
      elements.cartModal.close();
    });
  }

  // Закрытие модалок по клику вне контента
  window.addEventListener("click", (e) => {
    if (e.target === elements.cartModal) elements.cartModal.close();
    if (e.target === elements.successModal) elements.successModal.close();
  });

  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (elements.cartModal.open) elements.cartModal.close();
      if (elements.successModal.open) elements.successModal.close();
    }
  });

  console.log("Computer Shop application initialized successfully");
}

// Запуск приложения после полной загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
