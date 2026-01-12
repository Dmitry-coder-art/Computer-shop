import { products } from "./database.js";

export const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

function createProductCard(product, cart) {
  const card = document.createElement("article");
  card.className = "product-card";

  const hasDiscount = product.discountedPrice !== null;
  const displayPrice = hasDiscount ? product.discountedPrice : product.price;

  const specsHTML =
    product.specs && product.specs.length > 0
      ? `
            <div class="product-card__specs">
                <div class="product-card__specs-title">Характеристики</div>
                <div class="product-card__specs-list">
                    ${product.specs
                      .map(
                        (spec) => `
                        <div class="product-card__specs-item">
                            <span class="product-card__specs-key">${spec.key}</span>
                            <span class="product-card__specs-value">${spec.value}</span>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
        `
      : "";

  card.innerHTML = `
        <img src="${product.images[0]}" alt="${
    product.name
  }" class="product-card__image">
        <h2 class="product-card__title">${product.name}</h2>
        <p class="product-card__description">${product.description}</p>
        ${specsHTML}
        <div class="product-card__prices">
            ${
              hasDiscount
                ? `<span class="product-card__old-price">${formatPrice(
                    product.price
                  )} ₽</span>`
                : ""
            }
            <span class="product-card__price ${
              hasDiscount ? "product-card__price--discounted" : ""
            }">
                ${formatPrice(displayPrice)} ₽
            </span>
        </div>
        <button class="product-card__button" data-id="${
          product.id
        }" data-name="${product.name}" data-price="${displayPrice}">
            В корзину
        </button>
    `;

  const button = card.querySelector(".product-card__button");
  button.addEventListener("click", () => {
    const { id, name, price } = button.dataset;
    cart.addToCart(id, name, Number(price));
  });

  return card;
}

export function renderProducts(container, cart) {
  container.innerHTML = "";
  products.forEach((product) => {
    container.appendChild(createProductCard(product, cart));
  });
}
