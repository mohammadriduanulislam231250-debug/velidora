document.addEventListener('DOMContentLoaded', () => {
  // Initialize the slider
  initSlider();
  
  // Load and render products
  loadProducts();
  
  // Setup cart functionality
  setupCart();
  
  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const nav = document.querySelector('.nav');
  
  if (mobileMenuToggle && nav) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenuToggle.classList.toggle('active');
      nav.classList.toggle('active');
    });
  }
  
  // Newsletter form submission
  const newsletterForm = document.querySelector('.newsletter-form');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      
      if (emailInput && emailInput.value) {
        // In a real application, you would send this to a server
        alert(`Thank you for subscribing with: ${emailInput.value}`);
        emailInput.value = '';
      }
    });
  }
  
  // Scroll to products when clicking "Shop Now" button
  const shopNowButtons = document.querySelectorAll('a[href="#products"]');
  
  shopNowButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      const productsSection = document.getElementById('products');
      
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});