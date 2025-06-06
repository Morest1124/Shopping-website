let currentSlide = 0;

function changeSlide(direction) {
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;

  slides[currentSlide].style.display = 'none';
  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  slides[currentSlide].style.display = 'block';
}

function adjustCarouselHeight() {
  const carousel = document.querySelector('.carousel');
  const slides = document.querySelectorAll('.slide');
  const maxHeight = Math.max(...Array.from(slides).map(slide => slide.offsetHeight));
  carousel.style.height = `${maxHeight}px`;
}

window.addEventListener('resize', adjustCarouselHeight);

// Initialize the carousel
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  slides.forEach((slide, index) => {
    slide.style.display = index === 0 ? 'block' : 'none';
  });
  adjustCarouselHeight(); // Adjust height on page load
});

// Fetch product data
function fetchProducts() {
  fetch('/api/products')
    .then(response => response.json())
    .then(data => {
      const productList = document.querySelector('.product-list');
      productList.innerHTML = data.map(product => `
        <div class="product-item">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p class="price">R ${product.price}</p>
          <button class="buy-button">Buy Now</button>
        </div>
      `).join('');
    })
    .catch(error => console.error('Error fetching products:', error));
}

// Handle contact form submission
function handleContactForm() {
  const form = document.querySelector('form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => alert(result.message))
      .catch(error => console.error('Error submitting contact form:', error));
  });
}

// Add product to cart with confirmation
function addToCart(productId, imageSrc, price) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const product = { id: productId, image: imageSrc, price };

  const cartItem = cart.find(item => item.id === productId);

  if (cartItem) {
    cartItem.quantity += 1; // Increment quantity if product already exists in the cart
  } else {
    cart.push({ ...product, quantity: 1 }); // Add new product to the cart
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  updateSubtotal(price); // Add the price of the item to the subtotal
  alert('Product added to cart!');
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCountElement = document.getElementById('cart-count');
  cartCountElement.textContent = cartCount;
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
});

function viewCart() {
  window.location.href = "cart.html";
}

// Attach event listeners to "Add to Cart" buttons
function attachAddToCartListeners() {
  const addButtons = document.querySelectorAll('.buy-button');
  addButtons.forEach((button, index) => {
    button.addEventListener('click', () => addToCart(index + 1)); // Use index + 1 as product ID
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  handleContactForm();
  attachAddToCartListeners();
});

function loadCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartList = document.querySelector('.cart-list');
  const subtotalElement = document.getElementById('subtotal');
  const totalElement = document.getElementById('total');
  const shippingCostElement = document.getElementById('shipping-cost');
  const discountElement = document.getElementById('discount');

  if (cart.length === 0) {
    cartList.innerHTML = '<p>Your cart is empty.</p>';
    subtotalElement.textContent = 'R 0';
    totalElement.textContent = 'R 0';
    return;
  }

  let subtotal = 0;
  cartList.innerHTML = cart.map(item => {
    subtotal += item.price * item.quantity;
    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div>
          <h4>${item.name || 'Product'}</h4>
          <p>Price: R ${item.price}</p>
          <p>Quantity: 
            <button onclick="updateQuantity(${item.id}, -1)">-</button>
            ${item.quantity}
            <button onclick="updateQuantity(${item.id}, 1)">+</button>
          </p>
          <p>Total: R ${item.price * item.quantity}</p>
          <button onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>
    `;
  }).join('');

  const shippingCost = document.querySelector('input[name="shipping"]:checked')?.value === 'express' ? 10 : 0;
  const discount = subtotal > 50 ? 5 : 0; // discount logic

  subtotalElement.textContent = `R ${subtotal}`;
  shippingCostElement.textContent = `R ${shippingCost}`;
  discountElement.textContent = `-R ${discount}`;
  totalElement.textContent = `R ${subtotal + shippingCost - discount}`;
}

function updateSubtotal(price) {
  const subtotalElement = document.getElementById('subtotal');
  let currentSubtotal = parseFloat(subtotalElement.textContent.replace('R ', '')) || 0;
  currentSubtotal += price;
  subtotalElement.textContent = `R ${currentSubtotal}`;
}
