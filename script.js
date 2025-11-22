// King's PrideNation - Main JavaScript

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Only initialize sample products if localStorage is empty (don't overwrite admin changes)
    if (!localStorage.getItem('shoes') || localStorage.getItem('shoes') === '[]') {
        initializeSampleProducts();
    }
    
    // Migrate existing products to add stockStatus if missing
    migrateProducts();
    
    // Load products
    loadProducts();
    
    // Update cart badge
    updateCartBadge();
    
    // Check admin login status
    checkAdminStatus();
    
    // Setup event listeners
    setupEventListeners();
    
    // Listen for product updates from admin panel
    setupProductUpdateListener();
}

// Migrate products to add stockStatus field if missing
function migrateProducts() {
    const shoes = getShoes();
    let updated = false;
    
    shoes.forEach(shoe => {
        if (!shoe.stockStatus) {
            shoe.stockStatus = 'in stock';
            updated = true;
        }
    });
    
    if (updated) {
        saveShoes(shoes);
    }
}

// Products Data - ONLY your images (kp1-kp6, kp8-kp13)
function initializeSampleProducts() {
    const sampleShoes = [
        {
            id: 1,
            name: "Crown Elite Sneakers",
            price: 4200,
            category: "Sneakers",
            sizes: [38, 39, 40, 41, 42, 43, 44],
            image: "images/kp1.jpg",
            stockStatus: "in stock"
        },
        {
            id: 2,
            name: "Royal Court Loafers",
            price: 3800,
            category: "Formal",
            sizes: [39, 40, 41, 42, 43],
            image: "images/kp2.jpg",
            stockStatus: "in stock"
        },
        {
            id: 3,
            name: "Majesty Boots",
            price: 4500,
            category: "Boots",
            sizes: [40, 41, 42, 43, 44, 45],
            image: "images/kp3.jpg",
            stockStatus: "in production"
        },
        {
            id: 4,
            name: "Pride Comfort Sandals",
            price: 2200,
            category: "Sandals",
            sizes: [38, 39, 40, 41, 42],
            image: "images/kp4.jpg",
            stockStatus: "in stock"
        },
        {
            id: 5,
            name: "Nation Runner Pro",
            price: 3900,
            category: "Sneakers",
            sizes: [38, 39, 40, 41, 42, 43, 44],
            image: "images/kp5.jpg",
            stockStatus: "in stock"
        },
        {
            id: 6,
            name: "King's Formal Oxford",
            price: 4100,
            category: "Formal",
            sizes: [39, 40, 41, 42, 43],
            image: "images/kp6.jpg",
            stockStatus: "in stock"
        },
        {
            id: 7,
            name: "Royal Guard Boots",
            price: 4400,
            category: "Boots",
            sizes: [40, 41, 42, 43, 44],
            image: "images/kp8.jpg",
            stockStatus: "out of stock"
        },
        {
            id: 8,
            name: "Beach Royalty Sandals",
            price: 1800,
            category: "Sandals",
            sizes: [38, 39, 40, 41, 42, 43],
            image: "images/kp9.jpg",
            stockStatus: "in stock"
        },
        {
            id: 9,
            name: "Elite Street Sneakers",
            price: 3600,
            category: "Sneakers",
            sizes: [38, 39, 40, 41, 42, 43, 44],
            image: "images/kp10.jpg",
            stockStatus: "in production"
        },
        {
            id: 10,
            name: "Executive Pride Loafers",
            price: 4000,
            category: "Formal",
            sizes: [39, 40, 41, 42, 43, 44],
            image: "images/kp11.jpg",
            stockStatus: "in stock"
        },
        {
            id: 11,
            name: "Royal Summer Sandals",
            price: 2400,
            category: "Sandals",
            sizes: [38, 39, 40, 41, 42],
            image: "images/kp12.jpg",
            stockStatus: "in stock"
        },
        {
            id: 12,
            name: "Crown Classic Sneakers",
            price: 3500,
            category: "Sneakers",
            sizes: [38, 39, 40, 41, 42, 43, 44],
            image: "images/kp13.jpg",
            stockStatus: "in stock"
        }
    ];
    
    // Clear old products and save only your images
    saveShoes(sampleShoes);
}

// LocalStorage Functions
function getShoes() {
    const shoes = localStorage.getItem('shoes');
    return shoes ? JSON.parse(shoes) : [];
}

function saveShoes(shoes) {
    localStorage.setItem('shoes', JSON.stringify(shoes));
}

function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load Products
function loadProducts(category = 'all') {
    // Force a fresh read from localStorage every time
    const freshShoes = JSON.parse(localStorage.getItem('shoes') || '[]');
    const productsGrid = document.getElementById('products-grid');
    
    if (!productsGrid) return;
    
    let filteredShoes = freshShoes;
    if (category !== 'all') {
        filteredShoes = freshShoes.filter(shoe => shoe.category === category);
    }
    
    if (filteredShoes.length === 0) {
        productsGrid.innerHTML = '<p class="col-span-full text-center text-gray-600 py-12">No products found in this category.</p>';
        return;
    }
    
    // Clear and rebuild the grid to ensure fresh data
    productsGrid.innerHTML = filteredShoes.map(shoe => {
        const stockStatus = shoe.stockStatus || 'in stock';
        const stockBadgeClass = stockStatus === 'in stock' ? 'bg-green-500' : 
                               stockStatus === 'in production' ? 'bg-yellow-500' : 'bg-red-500';
        const stockText = stockStatus === 'in stock' ? 'In Stock' : 
                         stockStatus === 'in production' ? 'In Production' : 'Out of Stock';
        const isOutOfStock = stockStatus === 'out of stock';
        
        return `
        <div class="product-card ${isOutOfStock ? 'opacity-75' : ''}">
            <div class="relative">
                <img src="${shoe.image}" alt="${shoe.name}" loading="lazy">
                <span class="absolute top-2 right-2 px-3 py-1 rounded-full text-white text-xs font-bold ${stockBadgeClass}">
                    ${stockText}
                </span>
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold mb-2 text-black">${shoe.name}</h3>
                <p class="text-2xl font-bold text-gold mb-4">KES ${shoe.price.toLocaleString()}</p>
                <p class="text-sm text-gray-600 mb-4">${shoe.category}</p>
                
                ${!isOutOfStock ? `
                <div class="size-selector">
                    ${shoe.sizes.map(size => `
                        <button class="size-btn" data-size="${size}" onclick="selectSize(this, ${shoe.id})">${size}</button>
                    `).join('')}
                </div>
                
                <div class="quantity-selector">
                    <button class="quantity-btn" onclick="changeQuantity(${shoe.id}, -1)">-</button>
                    <span class="quantity-display" id="qty-${shoe.id}">1</span>
                    <button class="quantity-btn" onclick="changeQuantity(${shoe.id}, 1)">+</button>
                </div>
                
                <button onclick="addToCart(${shoe.id})" class="btn-primary w-full mt-4">
                    Add to Cart
                </button>
                ` : `
                <div class="text-center py-4">
                    <p class="text-red-600 font-bold mb-2">Currently Unavailable</p>
                    <p class="text-sm text-gray-500">Check back soon!</p>
                </div>
                `}
            </div>
        </div>
        `;
    }).join('');
}

// Size Selection
let selectedSizes = {};
let quantities = {};

function selectSize(btn, shoeId) {
    const size = parseInt(btn.getAttribute('data-size'));
    const shoe = getShoes().find(s => s.id === shoeId);
    
    if (!shoe || !shoe.sizes.includes(size)) {
        return;
    }
    
    // Remove selected class from all size buttons for this shoe
    const card = btn.closest('.product-card');
    card.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
    
    // Add selected class to clicked button
    btn.classList.add('selected');
    
    selectedSizes[shoeId] = size;
}

function changeQuantity(shoeId, change) {
    if (!quantities[shoeId]) {
        quantities[shoeId] = 1;
    }
    
    quantities[shoeId] = Math.max(1, quantities[shoeId] + change);
    document.getElementById(`qty-${shoeId}`).textContent = quantities[shoeId];
}

// Add to Cart
function addToCart(shoeId) {
    const shoe = getShoes().find(s => s.id === shoeId);
    if (!shoe) return;
    
    // Check stock status
    const stockStatus = shoe.stockStatus || 'in stock';
    if (stockStatus === 'out of stock') {
        alert('This item is currently out of stock. Please check back later!');
        return;
    }
    
    if (stockStatus === 'in production') {
        const proceed = confirm('This item is in production. Your order will be processed once available. Continue?');
        if (!proceed) return;
    }
    
    const size = selectedSizes[shoeId];
    if (!size) {
        alert('Please select a size');
        return;
    }
    
    const quantity = quantities[shoeId] || 1;
    
    const cart = getCart();
    const existingItem = cart.findIndex(item => item.id === shoeId && item.size === size);
    
    if (existingItem !== -1) {
        cart[existingItem].quantity += quantity;
    } else {
        cart.push({
            id: shoeId,
            name: shoe.name,
            price: shoe.price,
            size: size,
            quantity: quantity,
            image: shoe.image
        });
    }
    
    saveCart(cart);
    updateCartBadge();
    
    // Reset quantity for this shoe
    quantities[shoeId] = 1;
    document.getElementById(`qty-${shoeId}`).textContent = '1';
    
    // Show success message
    showNotification('Item added to cart!');
}

// Update Cart Badge
function updateCartBadge() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const badge = document.getElementById('cart-badge');
    const badgeMobile = document.getElementById('cart-badge-mobile');
    
    if (badge) badge.textContent = totalItems;
    if (badgeMobile) badgeMobile.textContent = totalItems;
}

// Load Cart
function loadCart() {
    const cart = getCart();
    const cartItems = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const emptyCart = document.getElementById('empty-cart');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        emptyCart.classList.remove('hidden');
        cartSummary.classList.add('hidden');
        return;
    }
    
    emptyCart.classList.add('hidden');
    cartSummary.classList.remove('hidden');
    
    let total = 0;
    
    cartItems.innerHTML = cart.map((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        
        return `
            <div class="cart-item">
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div class="flex items-center space-x-4 flex-1">
                        <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded">
                        <div>
                            <h3 class="font-bold text-lg text-black">${item.name}</h3>
                            <p class="text-gray-600">Size: ${item.size}</p>
                            <p class="text-gold font-bold">KES ${item.price.toLocaleString()} each</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="flex items-center space-x-2">
                            <button onclick="updateCartQuantity(${index}, -1)" class="quantity-btn">-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button onclick="updateCartQuantity(${index}, 1)" class="quantity-btn">+</button>
                        </div>
                        <p class="text-xl font-bold text-black min-w-[120px] text-right">
                            KES ${subtotal.toLocaleString()}
                        </p>
                        <button onclick="removeFromCart(${index})" class="text-red-600 hover:text-red-800 font-bold">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('cart-total').textContent = `KES ${total.toLocaleString()}`;
}

// Update Cart Quantity
function updateCartQuantity(index, change) {
    const cart = getCart();
    cart[index].quantity = Math.max(1, cart[index].quantity + change);
    saveCart(cart);
    loadCart();
    updateCartBadge();
}

// Remove from Cart
function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    loadCart();
    updateCartBadge();
}

// WhatsApp Order
function confirmWhatsAppOrder() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    let message = "Hello King's PrideNation! I would like to place an order:\n\n";
    
    let total = 0;
    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        message += `${index + 1}. ${item.name} - Size ${item.size} - Qty: ${item.quantity} - KES ${item.price.toLocaleString()}\n`;
    });
    
    message += `\nTotal: KES ${total.toLocaleString()}\n\n`;
    message += "Name: [Please fill in]\n";
    message += "Location/Delivery: [Please fill in]";
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/254746058590?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

// Event Listeners Setup
function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-category');
            loadProducts(category);
        });
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#cart') {
                e.preventDefault();
                showCartSection();
                if (mobileMenu) mobileMenu.classList.add('hidden');
            } else if (href === '#home' || href === '#') {
                e.preventDefault();
                showMainSections();
                const target = document.querySelector('#home');
                if (target) {
                    setTimeout(() => {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                    if (mobileMenu) mobileMenu.classList.add('hidden');
                }
            } else if (href !== '#') {
                e.preventDefault();
                showMainSections();
                const target = document.querySelector(href);
                if (target) {
                    setTimeout(() => {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                    if (mobileMenu) mobileMenu.classList.add('hidden');
                }
            }
        });
    });
    
    // WhatsApp order button
    const whatsappBtn = document.getElementById('whatsapp-order-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', confirmWhatsAppOrder);
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-xl');
        } else {
            navbar.classList.remove('shadow-xl');
        }
    });
    
    // Admin login button
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminLoginBtnMobile = document.getElementById('admin-login-btn-mobile');
    const adminModal = document.getElementById('admin-modal');
    const adminSubmit = document.getElementById('admin-submit');
    const adminCancel = document.getElementById('admin-cancel');
    const adminPassword = document.getElementById('admin-password');
    
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', showAdminModal);
    }
    
    if (adminLoginBtnMobile) {
        adminLoginBtnMobile.addEventListener('click', showAdminModal);
    }
    
    if (adminSubmit) {
        adminSubmit.addEventListener('click', handleAdminLogin);
    }
    
    if (adminCancel) {
        adminCancel.addEventListener('click', hideAdminModal);
    }
    
    // Close modal on outside click
    if (adminModal) {
        adminModal.addEventListener('click', function(e) {
            if (e.target === adminModal) {
                hideAdminModal();
            }
        });
    }
    
    // Enter key to submit admin password
    if (adminPassword) {
        adminPassword.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleAdminLogin();
            }
        });
    }
}

// Show Cart Section
function showCartSection() {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        if (section.id !== 'cart') {
            section.style.display = 'none';
        }
    });
    
    // Show cart section
    const cartSection = document.getElementById('cart');
    if (cartSection) {
        cartSection.style.display = 'block';
        loadCart();
        setTimeout(() => {
            cartSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
}

// Show other sections when navigating away from cart
function showMainSections() {
    document.querySelectorAll('section').forEach(section => {
        if (section.id !== 'cart') {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
}

// Admin Session Management
function isAdminLoggedIn() {
    return sessionStorage.getItem('adminLoggedIn') === 'true';
}

function setAdminLoggedIn(status) {
    if (status) {
        sessionStorage.setItem('adminLoggedIn', 'true');
    } else {
        sessionStorage.removeItem('adminLoggedIn');
    }
    checkAdminStatus();
}

function checkAdminStatus() {
    const adminLink = document.getElementById('admin-link');
    const adminLinkMobile = document.getElementById('admin-link-mobile');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminLoginBtnMobile = document.getElementById('admin-login-btn-mobile');
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    const adminLogoutBtnMobile = document.getElementById('admin-logout-btn-mobile');
    
    if (isAdminLoggedIn()) {
        if (adminLink) adminLink.classList.remove('hidden');
        if (adminLinkMobile) adminLinkMobile.classList.remove('hidden');
        if (adminLogoutBtn) adminLogoutBtn.classList.remove('hidden');
        if (adminLogoutBtnMobile) adminLogoutBtnMobile.classList.remove('hidden');
        if (adminLoginBtn) adminLoginBtn.classList.add('hidden');
        if (adminLoginBtnMobile) adminLoginBtnMobile.classList.add('hidden');
    } else {
        if (adminLink) adminLink.classList.add('hidden');
        if (adminLinkMobile) adminLinkMobile.classList.add('hidden');
        if (adminLogoutBtn) adminLogoutBtn.classList.add('hidden');
        if (adminLogoutBtnMobile) adminLogoutBtnMobile.classList.add('hidden');
        if (adminLoginBtn) adminLoginBtn.classList.remove('hidden');
        if (adminLoginBtnMobile) adminLoginBtnMobile.classList.remove('hidden');
    }
}

function logoutAdmin() {
    if (confirm('Are you sure you want to logout?')) {
        setAdminLoggedIn(false);
        showNotification('Logged out successfully');
    }
}

function showAdminModal() {
    const modal = document.getElementById('admin-modal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.remove('hidden');
        document.getElementById('admin-password').focus();
    }
}

function hideAdminModal() {
    const modal = document.getElementById('admin-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.add('hidden');
        document.getElementById('admin-password').value = '';
        document.getElementById('admin-error').classList.add('hidden');
    }
}

function handleAdminLogin() {
    const password = document.getElementById('admin-password').value;
    const errorDiv = document.getElementById('admin-error');
    
    if (password === 'king2025') {
        setAdminLoggedIn(true);
        hideAdminModal();
        showNotification('Admin access granted!');
    } else {
        errorDiv.textContent = 'Incorrect password. Please try again.';
        errorDiv.classList.remove('hidden');
        document.getElementById('admin-password').value = '';
        document.getElementById('admin-password').focus();
    }
}

// Show Notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-gold text-black px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Get current active category filter
function getCurrentCategory() {
    const activeFilter = document.querySelector('.filter-btn.active');
    return activeFilter ? activeFilter.getAttribute('data-category') || 'all' : 'all';
}

// Listen for product updates from admin panel (works across tabs/windows)
function setupProductUpdateListener() {
    // Listen for storage events (when localStorage changes in another tab/window)
    window.addEventListener('storage', function(e) {
        if (e.key === 'shoes') {
            // Products were updated in admin panel
            const currentCategory = getCurrentCategory();
            loadProducts(currentCategory);
            showNotification('✨ Products updated!');
        }
    });
    
    // Also listen for custom events (for same-window updates)
    window.addEventListener('productsUpdated', function() {
        const currentCategory = getCurrentCategory();
        loadProducts(currentCategory);
        showNotification('✨ Products updated!');
    });
    
    // Poll for changes (fallback for same-origin updates)
    // Only check if we're on the shop page
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        let lastProductsHash = '';
        // Initialize hash after a short delay to get initial state
        setTimeout(() => {
            const initialShoes = JSON.parse(localStorage.getItem('shoes') || '[]');
            lastProductsHash = JSON.stringify(initialShoes);
        }, 500);
        
        setInterval(function() {
            const freshShoes = JSON.parse(localStorage.getItem('shoes') || '[]');
            const currentHash = JSON.stringify(freshShoes);
            if (currentHash !== lastProductsHash && lastProductsHash !== '') {
                const currentCategory = getCurrentCategory();
                loadProducts(currentCategory);
                showNotification('✨ Products updated!');
            }
            lastProductsHash = currentHash;
        }, 500); // Check every 500ms for faster updates
    }
}

// Make functions globally available
window.selectSize = selectSize;
window.changeQuantity = changeQuantity;
window.addToCart = addToCart;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.confirmWhatsAppOrder = confirmWhatsAppOrder;
window.loadCart = loadCart;
window.getShoes = getShoes;
window.saveShoes = saveShoes;
window.initializeSampleProducts = initializeSampleProducts;
window.showMainSections = showMainSections;
window.isAdminLoggedIn = isAdminLoggedIn;
window.setAdminLoggedIn = setAdminLoggedIn;
window.checkAdminStatus = checkAdminStatus;
window.logoutAdmin = logoutAdmin;

