document.addEventListener('DOMContentLoaded', function() {
    // Sample product data
    const products = [
        {
            id: 1,
            name: "Premium Notebook",
            price: 120,
            image: "images/card 4.png",
            category: "school",
            rating: 4.5,
            inStock: true
        },
        {
            id: 2,
            name: "Art Brush Set",
            price: 350,
            image: "images/card 3.png",
            category: "art",
            rating: 4.8,
            inStock: true
        },
        {
            id: 3,
            name: "Colored Pencils",
            price: 180,
            image: "images/card 6.png",
            category: "art",
            rating: 4.2,
            inStock: true
        },
        {
            id: 4,
            name: "Office Desk Organizer",
            price: 450,
            image: "images/card 1.png",
            category: "office",
            rating: 4.0,
            inStock: true
        },
        {
            id: 5,
            name: "Craft Paper Set",
            price: 220,
            image: "images/card 2.png",
            category: "art",
            rating: 4.6,
            inStock: true
        },
        {
            id: 6,
            name: "Gel Pens Pack",
            price: 150,
            image: "images/card 5.png",
            category: "school",
            rating: 4.3,
            inStock: true
        },
        {
            id: 7,
            name: "Desk Calendar",
            price: 180,
            image: "images/card 1.png",
            category: "office",
            rating: 3.9,
            inStock: false
        },
        {
            id: 8,
            name: "Watercolor Set",
            price: 480,
            image: "images/card 3.png",
            category: "art",
            rating: 4.7,
            inStock: true
        },
        {
            id: 9,
            name: "Sticky Notes",
            price: 80,
            image: "images/card 5.png",
            category: "office",
            rating: 4.1,
            inStock: true
        },
        {
            id: 10,
            name: "School Backpack",
            price: 850,
            image: "images/card 4.png",
            category: "school",
            rating: 4.4,
            inStock: true
        },
        {
            id: 11,
            name: "Geometry Set",
            price: 120,
            image: "images/card 6.png",
            category: "school",
            rating: 4.2,
            inStock: true
        },
        {
            id: 12,
            name: "Desk Lamp",
            price: 650,
            image: "images/card 2.png",
            category: "office",
            rating: 4.5,
            inStock: false
        }
    ];

    // Initialize cart from localStorage or empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();

    // Get DOM elements
    const productsContainer = document.getElementById('productsContainer');
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'), {});
    const cartItemsList = document.getElementById('cartItemsList');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Filter elements
    const categoryFilters = document.querySelectorAll('.filter-checkbox[value]');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const inStockFilter = document.getElementById('inStock');
    const outOfStockFilter = document.getElementById('outOfStock');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const sortOptions = document.getElementById('sortOptions');
    const productCount = document.getElementById('productCount');

    // Only initialize products if we're on the products page
    if (productsContainer) {
        displayProducts(products);
        
        // Set up event listeners for filters
        categoryFilters.forEach(filter => {
            filter.addEventListener('change', filterProducts);
        });
        
        priceRange.addEventListener('input', function() {
            priceValue.textContent = `₹${this.value}+`;
            filterProducts();
        });
        
        inStockFilter.addEventListener('change', filterProducts);
        outOfStockFilter.addEventListener('change', filterProducts);
        
        resetFiltersBtn.addEventListener('click', resetFilters);
        
        sortOptions.addEventListener('change', filterProducts);
    }

    // Cart button click event
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            renderCart();
            cartModal.show();
        });
    }

    // Checkout button click event
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length > 0) {
                alert('Thank you for your purchase! Your order has been placed.');
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                cartModal.hide();
            }
        });
    }

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                    field.classList.add('is-valid');
                }
            });
            
            if (isValid) {
                // Show success message
                const successModal = new bootstrap.Modal(document.getElementById('successModal'));
                successModal.show();
                
                // Reset form
                contactForm.reset();
                contactForm.querySelectorAll('.is-valid').forEach(field => {
                    field.classList.remove('is-valid');
                });
            }
        });
    }

    // Function to display products
    function displayProducts(productsToDisplay) {
        if (!productsContainer) return;
        
        productsContainer.innerHTML = '';
        
        if (productsToDisplay.length === 0) {
            productsContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-search fa-3x mb-3 text-muted"></i>
                    <p class="lead">No products match your filters</p>
                    <button class="btn btn-outline-primary mt-3" onclick="resetFilters()">Reset Filters</button>
                </div>
            `;
            productCount.textContent = '0 products';
            return;
        }
        
        productCount.textContent = `${productsToDisplay.length} products`;
        
        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'col';
            
            // Generate star rating HTML
            const stars = generateStarRating(product.rating);
            
            productCard.innerHTML = `
                <div class="card product-card h-100">
                    <div class="product-img-container">
                        <img src="${product.image}" class="product-img" alt="${product.name}">
                        ${!product.inStock ? '<span class="badge bg-danger product-badge">Out of Stock</span>' : ''}
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="product-title">${product.name}</h5>
                        <p class="product-category">${capitalizeFirstLetter(product.category)}</p>
                        <p class="product-price">₹${product.price.toFixed(2)}</p>
                        <div class="product-rating">
                            <div class="rating-stars">
                                ${stars}
                            </div>
                        </div>
                        <button class="btn btn-primary btn-add-cart mt-auto" 
                            data-id="${product.id}" 
                            ${!product.inStock ? 'disabled' : ''}>
                            ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                </div>
            `;
            
            productsContainer.appendChild(productCard);
        });
        
        // Add event listeners to "Add to Cart" buttons
        document.querySelectorAll('.btn-add-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }

    // Function to filter products
    function filterProducts() {
        // Get selected categories
        const selectedCategories = Array.from(categoryFilters)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        
        // Get price range
        const maxPrice = parseInt(priceRange.value);
        
        // Get stock status
        const showInStock = inStockFilter.checked;
        const showOutOfStock = outOfStockFilter.checked;
        
        // Filter products
        let filteredProducts = products.filter(product => {
            // Category filter
            const categoryMatch = selectedCategories.includes(product.category);
            
            // Price filter
            const priceMatch = product.price <= maxPrice;
            
            // Stock filter
            const stockMatch = (product.inStock && showInStock) || (!product.inStock && showOutOfStock);
            
            return categoryMatch && priceMatch && stockMatch;
        });
        
        // Sort products
        const sortBy = sortOptions.value;
        
        switch (sortBy) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                // Featured - no sorting needed
                break;
        }
        
        displayProducts(filteredProducts);
    }

    // Function to reset filters
    function resetFilters() {
        // Reset category filters
        categoryFilters.forEach(checkbox => {
            checkbox.checked = true;
        });
        
        // Reset price range
        priceRange.value = 2000;
        priceValue.textContent = '₹2000+';
        
        // Reset stock filters
        inStockFilter.checked = true;
        outOfStockFilter.checked = false;
        
        // Reset sort option
        sortOptions.value = 'featured';
        
        // Apply filters
        filterProducts();
    }

    // Function to add product to cart
    function addToCart(e) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        const product = products.find(p => p.id === productId);
        
        if (!product) return;
        
        // Check if product is already in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Show feedback
        const button = e.target;
        const originalText = button.textContent;
        
        button.textContent = 'Added!';
        button.classList.remove('btn-primary');
        button.classList.add('btn-success');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('btn-success');
            button.classList.add('btn-primary');
        }, 1500);
    }

    // Function to render cart
    function renderCart() {
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartItemsList.style.display = 'none';
            cartTotal.textContent = '₹0.00';
            return;
        }
        
        emptyCartMessage.style.display = 'none';
        cartItemsList.style.display = 'block';
        
        // Clear previous items
        cartItemsList.innerHTML = '';
        
        // Calculate total
        let total = 0;
        
        // Add cart items
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="row align-items-center">
                    <div class="col-2">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    </div>
                    <div class="col-5">
                        <h6 class="cart-item-title">${item.name}</h6>
                        <p class="cart-item-price">₹${item.price.toFixed(2)}</p>
                    </div>
                    <div class="col-3">
                        <div class="input-group">
                            <button class="btn btn-outline-secondary btn-sm quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
                            <input type="text" class="form-control form-control-sm text-center cart-item-quantity" value="${item.quantity}" readonly>
                            <button class="btn btn-outline-secondary btn-sm quantity-btn" data-action="increase" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <div class="col-1 text-end">
                        <span class="fw-bold">₹${itemTotal.toFixed(2)}</span>
                    </div>
                    <div class="col-1 text-end">
                        <i class="fas fa-trash cart-item-remove" data-id="${item.id}"></i>
                    </div>
                </div>
            `;
            
            cartItemsList.appendChild(cartItem);
        });
        
        // Add event listeners to quantity buttons and remove buttons
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', updateQuantity);
        });
        
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
        
        // Update total
        cartTotal.textContent = `₹${total.toFixed(2)}`;
    }

    // Function to update quantity
    function updateQuantity(e) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        const action = e.target.getAttribute('data-action');
        
        const cartItem = cart.find(item => item.id === productId);
        
        if (!cartItem) return;
        
        if (action === 'increase') {
            cartItem.quantity += 1;
        } else if (action === 'decrease') {
            cartItem.quantity -= 1;
            
            if (cartItem.quantity <= 0) {
                // Remove item if quantity is 0 or less
                cart = cart.filter(item => item.id !== productId);
            }
        }
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Re-render cart
        renderCart();
    }

    // Function to remove item from cart
    function removeFromCart(e) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        
        // Remove item from cart
        cart = cart.filter(item => item.id !== productId);
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Re-render cart
        renderCart();
    }

    // Function to update cart count
    function updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        if (cartCountElements.length === 0) return;
        
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            element.textContent = count;
        });
    }

    // Helper function to generate star rating
    function generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let starsHTML = '';
        
        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        // Add half star if needed
        if (halfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Add empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }

    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});
