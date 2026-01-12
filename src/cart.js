import { formatPrice } from "./products.js";

export function initCart(elements) {
  let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }

  function updateCartCounter() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    elements.basketCount.textContent = totalItems;
    
    // Анимация при изменении количества
    if (totalItems > 0) {
      elements.basketCount.classList.add('header__basket-count--animate');
      setTimeout(() => {
        elements.basketCount.classList.remove('header__basket-count--animate');
      }, 600);
    }
  }

  function updateCartVisibility() {
    const isEmpty = cartItems.length === 0;

    if (isEmpty) {
      elements.cartEmpty.style.display = "flex";
      elements.cartTotal.style.display = "none";
      elements.modalActions.style.display = "none";
    } else {
      elements.cartEmpty.style.display = "none";
      elements.cartTotal.style.display = "block";
      elements.modalActions.style.display = "flex";
    }
  }

  function addToCart(id, name, price) {
    const existingItem = cartItems.find((item) => item.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({ id, name, price, quantity: 1 });
    }

    saveCart();
    updateCartCounter();
  }

  function decreaseQuantity(id) {
    const itemIndex = cartItems.findIndex((item) => item.id === id);

    if (itemIndex !== -1) {
      if (cartItems[itemIndex].quantity > 1) {
        cartItems[itemIndex].quantity -= 1;
      } else {
        cartItems.splice(itemIndex, 1);
      }
      saveCart();
      renderCartModal();
      updateCartCounter();
    }
  }

  function increaseQuantity(id) {
    const itemIndex = cartItems.findIndex((item) => item.id === id);

    if (itemIndex !== -1) {
      cartItems[itemIndex].quantity += 1;
      saveCart();
      renderCartModal();
      updateCartCounter();
    }
  }

  function removeFromCart(id) {
    const itemIndex = cartItems.findIndex((item) => item.id === id);
    
    if (itemIndex !== -1) {
      const itemElement = document.querySelector(`.cart__item[data-id="${id}"]`);
      if (itemElement) {
        itemElement.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
          cartItems = cartItems.filter((item) => item.id !== id);
          saveCart();
          renderCartModal();
          updateCartCounter();
        }, 300);
      }
    }
  }

  function clearCart() {
    cartItems = [];
    saveCart();
    renderCartModal();
    updateCartCounter();
  }

  function createCartItemElement(item) {
    const element = document.createElement("div");
    element.className = "cart__item";
    element.setAttribute('data-id', item.id);

    const totalPrice = item.price * item.quantity;

    element.innerHTML = `
            <div class="cart__item-info">
                <span class="cart__item-name">${item.name}</span>
                <span class="cart__item-price">${formatPrice(
                  totalPrice
                )} ₽</span>
            </div>
            <div class="cart__item-controls">
                <div class="cart__item-quantity">
                    <button class="cart__item-quantity-btn" data-id="${
                      item.id
                    }" data-action="decrease">-</button>
                    <span class="cart__item-quantity-value">${
                      item.quantity
                    }</span>
                    <button class="cart__item-quantity-btn" data-id="${
                      item.id
                    }" data-action="increase">+</button>
                </div>
                <button class="cart__item-remove" data-id="${
                  item.id
                }" title="Удалить">×</button>
            </div>
        `;

    const decreaseBtn = element.querySelector('[data-action="decrease"]');
    const increaseBtn = element.querySelector('[data-action="increase"]');
    const removeBtn = element.querySelector(".cart__item-remove");

    decreaseBtn.addEventListener("click", () => decreaseQuantity(item.id));
    increaseBtn.addEventListener("click", () => increaseQuantity(item.id));
    removeBtn.addEventListener("click", () => removeFromCart(item.id));

    return element;
  }

  function renderCartModal() {
    updateCartVisibility();
    elements.cartItemsContainer.innerHTML = "";

    if (cartItems.length === 0) return;

    cartItems.forEach((item) => {
      elements.cartItemsContainer.appendChild(createCartItemElement(item));
    });

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    elements.cartTotal.textContent = `Итого: ${formatPrice(totalAmount)} ₽`;
  }

  function getItems() {
    return [...cartItems];
  }

  // Инициализация при загрузке
  updateCartCounter();

  return {
    addToCart,
    decreaseQuantity,
    increaseQuantity,
    removeFromCart,
    clearCart,
    renderCartModal,
    getItems,
    updateCartCounter,
  };
}
