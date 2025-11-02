async function loadProducts() {
  const productsGrid = document.getElementById('productsGrid');
  
  if (!productsGrid) return;
  
  try {
    // Fetch products data
    const response = await fetch('https://rijonshahariar.github.io/json-ecom/products.json');
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const data = await response.json();
    
    if (!data.products || !Array.isArray(data.products)) {
      throw new Error('Invalid products data');
    }
    
    productsGrid.innerHTML = '';
    
    data.products.forEach(product => {
      const productCard = createProductCard(product);
      productsGrid.appendChild(productCard);
    });
    
    setupProductFilters(data.products);
    
  } catch (error) {
    console.error('Error loading products:', error);
    productsGrid.innerHTML = `<p class="error-message">Failed to load products. Please try again later.</p>`;
  }
}

/**
 * Create a product card element
 * @param {Object} product - The product data
 * @returns {HTMLElement} - The product card element
 */
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.category = product.category;
  card.dataset.productId = product.id;
  
  // Format the price correctly
  const formattedPrice = formatPrice(product.price);
  const formattedOldPrice = product.oldPrice ? formatPrice(product.oldPrice) : null;
  
  // Generate star ratings
  const starsHTML = generateStarRating(product.rating);
  
  card.innerHTML = `
    <div class="product-image" style="background-image: url('${product.image}')">
      ${product.tag ? `<div class="product-tag ${product.tag}">${product.tag}</div>` : ''}
      <div class="product-actions">
        
      </div>
      <div class="product-add-to-cart" data-product-id="${product.id}">Add to Cart</div>
    </div>
    <div class="product-info">
      <div class="product-category">${capitalizeFirstLetter(product.category)}</div>
      <h3 class="product-name">${product.name}</h3>
      <div class="product-price">
        <span class="current-price">${formattedPrice}</span>
        ${formattedOldPrice ? `<span class="old-price">${formattedOldPrice}</span>` : ''}
      </div>
      <div class="product-rating">
        <div class="rating-stars">${starsHTML}</div>
        <div class="rating-count">(${product.ratingCount})</div>
      </div>
    </div>
  `;
  
  // Add event listener to "Add to Cart" button
  const addToCartBtn = card.querySelector('.product-add-to-cart');
  
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      // We'll implement this function in cart.js
      const event = new CustomEvent('add-to-cart', { 
        detail: { productId: product.id }
      });
      document.dispatchEvent(event);
    });
  }
  
  return card;
}

/**
 * Setup product filtering
 * @param {Array} products - The array of products
 */
function setupProductFilters(products) {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productsGrid = document.getElementById('productsGrid');
  
  if (!filterButtons.length || !productsGrid) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const filterValue = button.dataset.filter;
      
      // Show all products if filter is 'all'
      if (filterValue === 'all') {
        const productCards = productsGrid.querySelectorAll('.product-card');
        productCards.forEach(card => {
          card.style.display = 'block';
        });
        return;
      }
      
      // Filter products by category
      const productCards = productsGrid.querySelectorAll('.product-card');
      
      productCards.forEach(card => {
        if (card.dataset.category === filterValue) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Format price to currency string
 * @param {number} price - The price to format
 * @returns {string} - The formatted price
 */
function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

/**
 * Capitalize the first letter of a string
 * @param {string} string - The string to capitalize
 * @returns {string} - The capitalized string
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Generate HTML for star ratings
 * @param {number} rating - The rating (0-5)
 * @returns {string} - HTML for the star rating
 */
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  let starsHTML = '';
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="0" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
  }
  
  // Add half star if needed
  if (halfStar) {
    starsHTML += '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="0" stroke-linecap="round" stroke-linejoin="round"><defs><linearGradient id="half" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="50%" stop-color="currentColor" stop-opacity="1" /><stop offset="50%" stop-color="currentColor" stop-opacity="0" /></linearGradient></defs><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#half)"></polygon></svg>';
  }
  
  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
  }
  
  return starsHTML;
}