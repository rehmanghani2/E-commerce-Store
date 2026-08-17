// NovaStore JavaScript Core Engine

// Helper to get CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// TOAST NOTIFICATIONS
const Toast = {
  show(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};

// CART MANAGER
const Cart = {
  items: [],

  init() {
    const savedCart = localStorage.getItem('novastore_cart');
    if (savedCart) {
      try {
        this.items = JSON.parse(savedCart);
      } catch (e) {
        this.items = [];
      }
    }
    this.updateUI();
  },

  save() {
    localStorage.setItem('novastore_cart', JSON.stringify(this.items));
    this.updateUI();
  },

  addItem(product, quantity = 1) {
    const existing = this.items.find(i => i.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        title: product.title,
        price: parseFloat(product.price),
        image_url: product.image_url,
        quantity: quantity
      });
    }
    this.save();
    Toast.show(`Added "${product.title}" to cart!`, 'success');
  },

  removeItem(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.save();
  },

  updateQuantity(id, delta) {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.removeItem(id);
      } else {
        this.save();
      }
    }
  },

  clear() {
    this.items = [];
    this.save();
  },

  getTotalCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  },

  getSubtotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  updateUI() {
    const badge = document.querySelectorAll('.cart-badge');
    const totalCount = this.getTotalCount();
    badge.forEach(b => {
      b.textContent = totalCount;
      b.style.display = totalCount > 0 ? 'flex' : 'none';
    });

    const cartBody = document.getElementById('cartDrawerBody');
    const subtotalEl = document.getElementById('cartSubtotal');
    
    if (subtotalEl) {
      subtotalEl.textContent = `$${this.getSubtotal().toFixed(2)}`;
    }

    if (cartBody) {
      if (this.items.length === 0) {
        cartBody.innerHTML = `
          <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🛒</div>
            <p style="font-size: 1.1rem; font-weight: 600;">Your cart is empty</p>
            <p style="font-size: 0.9rem; margin-top: 0.5rem;">Explore our store and add awesome items!</p>
          </div>
        `;
      } else {
        cartBody.innerHTML = this.items.map(item => `
          <div class="cart-item">
            <img src="${item.image_url}" alt="${item.title}" class="cart-item-img" />
            <div class="cart-item-info">
              <div class="cart-item-title">${item.title}</div>
              <div class="cart-item-price">$${item.price.toFixed(2)}</div>
              <div class="qty-controls">
                <button class="qty-btn" onclick="Cart.updateQuantity(${item.id}, -1)">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn" onclick="Cart.updateQuantity(${item.id}, 1)">+</button>
              </div>
            </div>
            <button class="remove-item-btn" onclick="Cart.removeItem(${item.id})" title="Remove">✕</button>
          </div>
        `).join('');
      }
    }

    // Update Checkout Summary page if on checkout page
    const checkoutSummaryEl = document.getElementById('checkoutCartItems');
    const checkoutTotalEl = document.getElementById('checkoutTotalAmount');
    if (checkoutSummaryEl && checkoutTotalEl) {
      checkoutTotalEl.textContent = `$${this.getSubtotal().toFixed(2)}`;
      if (this.items.length === 0) {
        checkoutSummaryEl.innerHTML = `<p style="color: var(--text-muted);">No items in cart.</p>`;
      } else {
        checkoutSummaryEl.innerHTML = this.items.map(item => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--border-glass);">
            <div>
              <div style="font-weight: 600; font-size: 0.95rem;">${item.title}</div>
              <div style="font-size: 0.85rem; color: var(--text-muted);">${item.quantity} x $${item.price.toFixed(2)}</div>
            </div>
            <div style="font-weight: 700; color: var(--primary);">$${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        `).join('');
      }
    }
  }
};

// UI OVERLAY & MODAL CONTROLLER
function toggleCartDrawer(open = null) {
  const overlay = document.getElementById('cartOverlay');
  if (!overlay) return;
  if (open === true || (open === null && !overlay.classList.contains('open'))) {
    overlay.classList.add('open');
  } else {
    overlay.classList.remove('open');
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('open');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('open');
}

// QUICK VIEW MODAL
async function openQuickView(productId) {
  try {
    const response = await fetch(`/api/products/${productId}/`);
    const data = await response.json();
    if (!data.product) return;

    const p = data.product;
    const modalBody = document.getElementById('quickViewBody');
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="quickview-content">
          <div>
            <img src="${p.image_url}" alt="${p.title}" class="qv-img" />
          </div>
          <div style="display: flex; flex-direction: column; justify-content: center;">
            <span style="color: var(--primary); font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">${p.category_name}</span>
            <h2 style="font-size: 1.8rem; font-weight: 800; margin: 0.4rem 0;">${p.title}</h2>
            <div style="color: var(--amber); margin-bottom: 1rem;">★ ${p.rating} <span style="color: var(--text-dim); font-size: 0.85rem;">(${p.reviews_count} reviews)</span></div>
            <div style="display: flex; align-items: baseline; gap: 1rem; margin-bottom: 1rem;">
              <span style="font-size: 2rem; font-weight: 800; color: #fff;">$${p.price.toFixed(2)}</span>
              ${p.old_price ? `<span style="font-size: 1.1rem; color: var(--text-dim); text-decoration: line-through;">$${p.old_price.toFixed(2)}</span>` : ''}
            </div>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem; line-height: 1.6;">${p.description}</p>
            <div style="display: flex; gap: 1rem;">
              <button class="gradient-btn" style="flex: 1;" onclick="Cart.addItem({id: ${p.id}, title: '${p.title.replace(/'/g, "\\'")}', price: ${p.price}, image_url: '${p.image_url}'}); closeModal('quickViewModal');">
                Add to Cart 🛒
              </button>
              <a href="/product/${p.slug}/" class="btn-secondary">Details</a>
            </div>
          </div>
        </div>
      `;
      openModal('quickViewModal');
    }
  } catch (err) {
    console.error(err);
  }
}

// AUTH HANDLERS
async function checkAuthStatus() {
  try {
    const res = await fetch('/api/auth/user/');
    const data = await res.json();
    const userArea = document.getElementById('userAreaNav');
    if (!userArea) return;

    if (data.is_authenticated) {
      userArea.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
          <a href="/orders/" class="btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.85rem;">My Orders</a>
          <button class="btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.85rem;" onclick="handleLogout()">Logout (${data.username})</button>
        </div>
      `;
    } else {
      userArea.innerHTML = `
        <button class="user-btn" onclick="openModal('authModal')">
          👤 Sign In / Register
        </button>
      `;
    }
  } catch (e) {
    console.error(e);
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const username = form.username.value;
  const password = form.password.value;

  try {
    const res = await fetch('/api/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) {
      Toast.show(`Welcome back, ${data.user.username}!`, 'success');
      closeModal('authModal');
      checkAuthStatus();
    } else {
      Toast.show(data.error || 'Login failed', 'error');
    }
  } catch (err) {
    Toast.show('Error connecting to server', 'error');
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const form = e.target;
  const username = form.reg_username.value;
  const email = form.reg_email.value;
  const password = form.reg_password.value;

  try {
    const res = await fetch('/api/auth/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (data.success) {
      Toast.show(`Account created! Welcome, ${data.user.username}!`, 'success');
      closeModal('authModal');
      checkAuthStatus();
    } else {
      Toast.show(data.error || 'Registration failed', 'error');
    }
  } catch (err) {
    Toast.show('Error connecting to server', 'error');
  }
}

async function handleLogout() {
  await fetch('/api/auth/logout/', {
    method: 'POST',
    headers: {
      'X-CSRFToken': getCookie('csrftoken')
    }
  });
  Toast.show('Logged out successfully', 'info');
  checkAuthStatus();
}

// CHECKOUT SUBMISSION HANDLER
async function submitCheckout(e) {
  e.preventDefault();
  if (Cart.items.length === 0) {
    Toast.show('Your cart is empty!', 'error');
    return;
  }

  const form = e.target;
  const payload = {
    full_name: form.full_name.value,
    email: form.email.value,
    phone: form.phone.value,
    address: form.address.value,
    city: form.city.value,
    zip_code: form.zip_code.value,
    payment_method: form.payment_method.value,
    items: Cart.items
  };

  try {
    const res = await fetch('/api/order/place/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.success) {
      Cart.clear();
      const receiptModal = document.getElementById('orderSuccessModal');
      const orderNumEl = document.getElementById('receiptOrderNumber');
      const orderTotalEl = document.getElementById('receiptOrderTotal');
      
      if (orderNumEl) orderNumEl.textContent = data.order_number;
      if (orderTotalEl) orderTotalEl.textContent = `$${data.total_amount.toFixed(2)}`;

      if (receiptModal) {
        openModal('orderSuccessModal');
      } else {
        Toast.show(`Order ${data.order_number} placed successfully!`, 'success');
        window.location.href = '/';
      }
    } else {
      Toast.show(data.error || 'Failed to place order', 'error');
    }
  } catch (err) {
    Toast.show('Error processing order.', 'error');
  }
}

// INIT ON DOM LOAD
document.addEventListener('DOMContentLoaded', () => {
  Cart.init();
  checkAuthStatus();
});
