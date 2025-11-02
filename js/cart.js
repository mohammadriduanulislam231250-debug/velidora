function setupCart() {
  // DOM elements
  const cartToggle = document.getElementById('cartToggle');
  const cartPanel = document.getElementById('cartPanel');
  const closeCart = document.getElementById('closeCart');
  const overlay = document.getElementById('overlay');
  const cartItems = document.getElementById('cartItems');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartFooter = document.getElementById('cartFooter');
  const cartCount = document.getElementById('cartCount');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartShipping = document.getElementById('cartShipping');
  const cartDiscount = document.getElementById('cartDiscount');
  const cartTotal = document.getElementById('cartTotal');
  const discountRow = document.getElementById('discountRow');
  const couponCodeInput = document.getElementById('couponCode');
  const applyCouponBtn = document.getElementById('applyCoupon');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const startShopping = document.getElementById('startShopping');
  const successModal = document.getElementById('successModal');
  const closeSuccessModal = document.getElementById('closeSuccessModal');
  const continueShopping = document.getElementById('continueShopping');
  const orderNumber = document.getElementById('orderNumber');
  
  // Cart state
  let cart;
  let appliedCoupon = null;
  
  // Coupon codes
  const coupons = {
    'IIUC10': 0.10, // 10% off
    'IIUC20': 0.20 // 20% off
  };
  
  // Initialize cart
  cart = loadCartFromStorage() || [];
  updateCartDisplay();
  
  // Event Listeners
  // Open cart
  if (cartToggle) {
    cartToggle.addEventListener('click', () => {
      cartPanel.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }
  
  // Close cart
  if (closeCart) {
    closeCart.addEventListener('click', () => {
      cartPanel.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  
  // Close cart when clicking overlay
  if (overlay) {
    overlay.addEventListener('click', () => {
      cartPanel.classList.remove('active');
      overlay.classList.remove('active');
      successModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  
  // Start shopping button redirects to products
  if (startShopping) {
    startShopping.addEventListener('click', () => {
      cartPanel.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      
      const productsSection = document.getElementById('products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  
  // Apply coupon code
  if (applyCouponBtn && couponCodeInput) {
    applyCouponBtn.addEventListener('click', () => {
      const code = couponCodeInput.value.trim().toUpperCase();
      
      if (coupons[code]) {
        appliedCoupon = {
          code: code,
          discount: coupons[code]
        };
        
        updateCartTotals();
        
        // Show success message
        alert(`Coupon "${code}" applied successfully!`);
        
        // Clear the input
        couponCodeInput.value = '';
      } else {
        alert('Invalid coupon code. Please try again.');
      }
    });
  }
  
  // Checkout button
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
      }
      
      // Generate random order number
      const randomOrderNum = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
      if (orderNumber) {
        orderNumber.textContent = randomOrderNum;
      }
      
      // Show success modal
      successModal.classList.add('active');
      
      // Clear cart
      cart = [];
      saveCartToStorage();
      updateCartDisplay();
      
      // Hide cart panel
      cartPanel.classList.remove('active');
    });
  }
  
  // Close success modal
  if (closeSuccessModal) {
    closeSuccessModal.addEventListener('click', () => {
      successModal.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  
  // Continue shopping button
  if (continueShopping) {
    continueShopping.addEventListener('click', () => {
      successModal.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  
  // Listen for add to cart events
  document.addEventListener('add-to-cart', (e) => {
    const productId = e.detail.productId;
    addToCart(productId);
  });
  
  /**
   * Add a product to the cart
   * @param {number} productId - The ID of the product to add
   */
  async function addToCart(productId) {
    try {
      // Fetch product data
      const response = await fetch('./data/products.json');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      
      // Find the product
      const product = data.products.find(p => p.id === parseInt(productId));
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      // Check if the product is already in the cart
      const existingItemIndex = cart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        // Increment quantity if already in cart
        cart[existingItemIndex].quantity += 1;
      } else {
        // Add new item to cart
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      }
      
      // Save cart to localStorage
      saveCartToStorage();
      
      // Update the cart display
      updateCartDisplay();
      
      // Show the cart
      cartPanel.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    }
  }
  
  /**
   * Remove a product from the cart
   * @param {number} productId - The ID of the product to remove
   */
  function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== parseInt(productId));
    saveCartToStorage();
    updateCartDisplay();
  }
  
  /**
   * Update the quantity of a product in the cart
   * @param {number} productId - The ID of the product
   * @param {number} newQuantity - The new quantity
   */
  function updateQuantity(productId, newQuantity) {
    const index = cart.findIndex(item => item.id === parseInt(productId));
    
    if (index !== -1) {
      if (newQuantity <= 0) {
        // Remove item if quantity is zero or negative
        removeFromCart(productId);
      } else {
        // Update quantity
        cart[index].quantity = newQuantity;
        saveCartToStorage();
        updateCartDisplay();
      }
    }
  }
  
  /**
   * Update the cart display
   */
  function updateCartDisplay() {
    if (!cartItems || !cartEmpty || !cartFooter || !cartCount) return;
    
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Show/hide empty cart message and footer
    if (cart.length === 0) {
      cartEmpty.style.display = 'flex';
      cartItems.style.display = 'none';
      cartFooter.style.display = 'none';
      return;
    } else {
      cartEmpty.style.display = 'none';
      cartItems.style.display = 'block';
      cartFooter.style.display = 'block';
    }
    
    // Render cart items
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          <div class="cart-item-quantity">
            <button class="quantity-btn decrease" data-id="${item.id}">-</button>
            <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
            <button class="quantity-btn increase" data-id="${item.id}">+</button>
          </div>
        </div>
        <div class="cart-item-remove" data-id="${item.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </div>
      `;
      
      cartItems.appendChild(cartItem);
    });
    
    // Add event listeners to cart item buttons
    const decreaseButtons = cartItems.querySelectorAll('.decrease');
    const increaseButtons = cartItems.querySelectorAll('.increase');
    const quantityInputs = cartItems.querySelectorAll('.quantity-input');
    const removeButtons = cartItems.querySelectorAll('.cart-item-remove');
    
    decreaseButtons.forEach(button => {
      button.addEventListener('click', () => {
        const productId = button.dataset.id;
        const index = cart.findIndex(item => item.id === parseInt(productId));
        
        if (index !== -1) {
          const newQuantity = cart[index].quantity - 1;
          updateQuantity(productId, newQuantity);
        }
      });
    });
    
    increaseButtons.forEach(button => {
      button.addEventListener('click', () => {
        const productId = button.dataset.id;
        const index = cart.findIndex(item => item.id === parseInt(productId));
        
        if (index !== -1) {
          const newQuantity = cart[index].quantity + 1;
          updateQuantity(productId, newQuantity);
        }
      });
    });
    
    quantityInputs.forEach(input => {
      input.addEventListener('change', () => {
        const productId = input.dataset.id;
        const newQuantity = parseInt(input.value);
        
        if (!isNaN(newQuantity)) {
          updateQuantity(productId, newQuantity);
        }
      });
    });
    
    removeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const productId = button.dataset.id;
        removeFromCart(productId);
      });
    });
    
    // Update totals
    updateCartTotals();
  }
  
  /**
   * Update the cart totals
   */
  function updateCartTotals() {
    if (!cartSubtotal || !cartShipping || !cartDiscount || !cartTotal || !discountRow) return;
    
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Calculate shipping (flat rate of $5.99 if subtotal > 0)
    const shipping = subtotal > 0 ? 5.99 : 0;
    
    // Calculate discount if coupon is applied
    let discount = 0;
    if (appliedCoupon && subtotal > 0) {
      discount = subtotal * appliedCoupon.discount;
      discountRow.classList.add('active');
    } else {
      discountRow.classList.remove('active');
    }
    
    // Calculate total
    const total = subtotal + shipping - discount;
    
    // Update display
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    cartShipping.textContent = subtotal > 0 ? `$${shipping.toFixed(2)}` : 'Free';
    cartDiscount.textContent = `-$${discount.toFixed(2)}`;
    cartTotal.textContent = `$${total.toFixed(2)}`;
  }
  
  /**
   * Save cart to localStorage
   */
  function saveCartToStorage() {
    localStorage.setItem('eleganceCart', JSON.stringify({
      items: cart,
      coupon: appliedCoupon
    }));
  }
  
  /**
   * Load cart from localStorage
   * @returns {Array} - The cart items
   */
  function loadCartFromStorage() {
    const savedCart = localStorage.getItem('eleganceCart');
    
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      appliedCoupon = parsedCart.coupon;
      return parsedCart.items || [];
    }
    
    return null;
  }
}