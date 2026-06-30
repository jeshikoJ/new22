import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD0wfPJHbeTjkoEhmvLFI7taB53q6IgApI",
  authDomain: "new-born-f2cb6.firebaseapp.com",
  projectId: "new-born-f2cb6",
  storageBucket: "new-born-f2cb6.firebasestorage.app",
  messagingSenderId: "171649936148",
  appId: "1:171649936148:web:ded54cc43e130cf987f001",
  measurementId: "G-706ZL2PPPV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const menuItems = [
    {
        id: 1,
        name: "Classic Idli",
        description: "Soft, fluffy steamed rice cakes served with sambar and two types of chutney.",
        price: 40,
        image: "static/images/classic_idli.jpg"
    },
    {
        id: 2,
        name: "Masala Dosa",
        description: "Crispy golden crepe stuffed with spiced potato filling. A South Indian classic.",
        price: 70,
        image: "static/images/masala_dosa.jpg"
    },
    {
        id: 3,
        name: "Medu Vada",
        description: "Crispy lentil doughnuts with a fluffy interior, perfect with hot filter coffee.",
        price: 35,
        image: "static/images/medu_vada.jpg"
    },
    {
        id: 4,
        name: "Ven Pongal",
        description: "Comforting rice and lentil dish tempered with black pepper, cumin, and ghee.",
        price: 60,
        image: "static/images/ven_pongal.jpg"
    },
    {
        id: 5,
        name: "Hyderabadi Dum Biryani",
        description: "Aromatic basmati rice cooked with fragrant spices and tender marinated meat/veg.",
        price: 180,
        image: "static/images/dum_biryani.jpg"
    },
    {
        id: 6,
        name: "Filter Coffee",
        description: "Strong, sweet, and frothy traditional South Indian coffee served in a brass tumbler.",
        price: 25,
        image: "static/images/filter_coffee.jpg"
    },
    {
        id: 7,
        name: "Onion Uttapam",
        description: "Thick, savory pancake topped with finely chopped onions, green chilies, and coriander.",
        price: 55,
        image: "static/images/onion_uttapam.jpg"
    },
    {
        id: 8,
        name: "South Indian Meals (Thali)",
        description: "A complete feast with rice, sambar, rasam, kootu, poriyal, papad, and payasam.",
        price: 150,
        image: "static/images/south_indian_thali.jpg"
    },
    {
        id: 9,
        name: "Lemon Rice",
        description: "Tangy and flavorful rice tempered with mustard seeds, curry leaves, peanuts, and lemon.",
        price: 65,
        image: "static/images/lemon_rice.jpg"
    },
    {
        id: 10,
        name: "Appam with Stew",
        description: "Lace-edged rice hoppers served with a mild, fragrant coconut milk-based vegetable stew.",
        price: 90,
        image: "static/images/appam_stew.jpg"
    },
    {
        id: 11,
        name: "Ghee Roast Dosa",
        description: "A massive, paper-thin crispy dosa shaped like a cone, dripping with aromatic pure ghee.",
        price: 95,
        image: "static/images/ghee_roast_dosa.jpg"
    },
    {
        id: 12,
        name: "Puttu & Kadala Curry",
        description: "Steamed cylinders of ground rice and coconut, paired with spicy black chickpea curry.",
        price: 85,
        image: "static/images/puttu_kadala.jpg"
    },
    {
        id: 13,
        name: "Malabar Parotta",
        description: "Flaky, multi-layered flatbread pan-fried to perfection, served with rich spicy curry.",
        price: 60,
        image: "static/images/malabar_parotta.jpg"
    },
    {
        id: 14,
        name: "Chicken Chettinad",
        description: "A fiery, robust South Indian chicken curry packed with freshly roasted aromatic spices.",
        price: 220,
        image: "static/images/chicken_chettinad.jpg"
    },
    {
        id: 15,
        name: "Mysore Pak",
        description: "A rich, melt-in-the-mouth traditional dessert made from generous amounts of ghee, sugar, and gram flour.",
        price: 50,
        image: "static/images/mysore_pak.jpg"
    }
];

let cart = [];

// Initialize Menu
function renderMenu() {
    const menuGrid = document.getElementById('menu-grid');
    
    menuItems.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'menu-item';
        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item-img" loading="lazy">
            <div class="item-content">
                <div class="item-header">
                    <h3>${item.name}</h3>
                    <span class="price">₹${item.price}</span>
                </div>
                <p class="item-desc">${item.description}</p>
                <button class="add-to-cart" data-id="${item.id}">
                    Add to Order
                </button>
            </div>
        `;
        menuGrid.appendChild(itemEl);
    });

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.getAttribute('data-id'));
            addToCart(id);
        });
    });
}

// Cart Logic
function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    const existing = cart.find(i => i.id === id);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCart();
    
    // Smooth scroll to cart if not visible
    const cartSection = document.getElementById('cart-section');
    cartSection.scrollIntoView({ behavior: 'smooth' });
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCart();
}

function changeQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCart();
        }
    }
}

function updateCart() {
    const cartItemsEl = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const cartCountEl = document.getElementById('cart-count');
    const checkoutOnlineBtn = document.getElementById('checkout-online-btn');
    const checkoutWaBtn = document.getElementById('checkout-wa-btn');
    
    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p class="empty-cart" style="text-align:center; color:var(--text-muted);">Your cart is empty.</p>';
        cartTotalEl.textContent = '₹0';
        cartCountEl.textContent = '0';
        if (checkoutOnlineBtn) checkoutOnlineBtn.disabled = true;
        if (checkoutWaBtn) checkoutWaBtn.disabled = true;
        return;
    }
    
    if (checkoutOnlineBtn) checkoutOnlineBtn.disabled = false;
    if (checkoutWaBtn) checkoutWaBtn.disabled = false;
    
    let total = 0;
    let totalItems = 0;
    cartItemsEl.innerHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        totalItems += item.quantity;
        
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">₹${item.price} x ${item.quantity} = ₹${itemTotal}</div>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" data-action="minus" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
            </div>
        `;
        cartItemsEl.appendChild(itemEl);
    });
    
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.getAttribute('data-id'));
            const action = e.currentTarget.getAttribute('data-action');
            changeQuantity(id, action === 'plus' ? 1 : -1);
        });
    });
    
    cartTotalEl.textContent = `₹${total}`;
    cartCountEl.textContent = totalItems;
}

// Delivery Modal Logic (Online Order)
function checkoutOnline() {
    if (cart.length === 0) return;
    const modal = document.getElementById('delivery-modal');
    modal.style.display = 'flex';
}

// Direct WhatsApp Order
function checkoutWhatsApp() {
    if (cart.length === 0) return;
    
    let message = "Hello Hotel New Born, I would like to place an order:\n\n";
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `${item.quantity}x ${item.name} - ₹${itemTotal}\n`;
    });
    
    message += `\n*Total Amount: ₹${total}*\n`;
    message += "\nPlease let me know the preparation time and payment details. Thank you!";
    
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "917395881571";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

async function handleOrderSubmission(e) {
    e.preventDefault();
    
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('customer-address').value;
    const confirmBtn = document.getElementById('confirm-order-btn');
    
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Saving Order...';
    
    let total = 0;
    let orderItems = [];
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        orderItems.push({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: itemTotal
        });
    });

    try {
        // Save to Firebase
        await addDoc(collection(db, "orders"), {
            customerName: name,
            customerPhone: phone,
            customerAddress: address,
            items: orderItems,
            totalAmount: total,
            status: "Pending",
            timestamp: serverTimestamp()
        });
        
        // Success notification
        alert("Your order has been placed successfully! We will prepare it right away.");
        
        // Clean up
        document.getElementById('delivery-modal').style.display = 'none';
        cart = [];
        updateCart();
        document.getElementById('delivery-form').reset();
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("There was an error saving your order. Please try again.");
    } finally {
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirm Order';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    
    const onlineBtn = document.getElementById('checkout-online-btn');
    if (onlineBtn) onlineBtn.addEventListener('click', checkoutOnline);
    
    const waBtn = document.getElementById('checkout-wa-btn');
    if (waBtn) waBtn.addEventListener('click', checkoutWhatsApp);
    
    document.getElementById('delivery-form').addEventListener('submit', handleOrderSubmission);
    
    // Modal Close
    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('delivery-modal').style.display = 'none';
    });
    
    // Initialize 3D Tilt Automation
    VanillaTilt.init(document.querySelectorAll(".menu-item"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        scale: 1.05
    });

    VanillaTilt.init(document.querySelectorAll(".info-card, .reviews-card"), {
        max: 5,
        speed: 400,
        glare: true,
        "max-glare": 0.1
    });

    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');
    
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu on click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
});

// Expose functions to global scope for inline HTML onclick handlers
window.addToCart = addToCart;
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;
