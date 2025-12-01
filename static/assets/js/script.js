// script.js - cart logic & drawer behavior
(function(){
  // Utilities
  const qs = sel => document.querySelector(sel);
  const qsa = sel => document.querySelectorAll(sel);
  const formatCurrency = n => `₦${Number(n).toLocaleString()}`;

  // Elements
  const cartBtn = qs('#cartBtn');
  const cartCountEl = qs('#cart-count');
  const cartDrawer = qs('#cartDrawer');
  const overlay = qs('#overlay');
  const closeCart = qs('#closeCart');
  const cartItemsEl = qs('#cartItems');
  const cartTotalEl = qs('#cartTotal');
  const checkoutBtn = qs('#checkoutBtn');
  const yearEl = qs('#year');

  // State (persist)
  const STORAGE_KEY = 'luxe_cart_v1';
  let cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  // Init
  yearEl.textContent = new Date().getFullYear();
  renderCartCount();
  renderCartItems();

  // Add to cart buttons
  qsa('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const price = Number(btn.dataset.price);
      const img = btn.closest('.product-card').querySelector('img')?.src || '';
      addToCart({ name, price, img });
      openCart();
    });
  });

  // Add item logic
  function addToCart(item){
    const idx = cart.findIndex(i => i.name === item.name);
    if(idx > -1){
      cart[idx].qty += 1;
    } else {
      cart.push({ ...item, qty: 1 });
    }
    persist();
    renderCartCount();
    renderCartItems();
  }

  function removeFromCart(name){
    cart = cart.filter(i => i.name !== name);
    persist();
    renderCartCount();
    renderCartItems();
  }

  function updateQty(name, qty){
    const idx = cart.findIndex(i => i.name === name);
    if(idx > -1){
      cart[idx].qty = qty <= 0 ? 0 : qty;
      if(cart[idx].qty === 0) removeFromCart(name);
      else {
        persist();
        renderCartCount();
        renderCartItems();
      }
    }
  }

  function persist(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function getTotal(){
    return cart.reduce((s,i) => s + (i.price * i.qty), 0);
  }

  // Renderers
  function renderCartCount(){
    cartCountEl.textContent = cart.reduce((s,i) => s + i.qty, 0);
  }

  function renderCartItems(){
    cartItemsEl.innerHTML = '';
    if(cart.length === 0){
      cartItemsEl.innerHTML = `<p class="muted" style="padding:1rem;">Your cart is empty.</p>`;
      cartTotalEl.textContent = formatCurrency(0);
      return;
    }

    cart.forEach(item => {
      const div = document.createElement('div');
      div.className = 'cart-item';

      div.innerHTML = `
        <img src="${item.img}" alt="${escapeHtml(item.name)}">
        <div class="meta">
          <h4>${escapeHtml(item.name)}</h4>
          <p>${formatCurrency(item.price)} &times; ${item.qty} = <strong>${formatCurrency(item.price * item.qty)}</strong></p>
          <div class="qty-controls">
            <button class="qty-decr" data-name="${escapeHtml(item.name)}">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-incr" data-name="${escapeHtml(item.name)}">+</button>
            <button class="remove-btn" data-name="${escapeHtml(item.name)}">Remove</button>
          </div>
        </div>
      `;

      cartItemsEl.appendChild(div);
    });

    // attach events for incr/decr/remove
    qsa('.qty-incr').forEach(b => b.addEventListener('click', e => {
      const name = e.currentTarget.dataset.name;
      const item = cart.find(i => i.name === name);
      if(item) updateQty(name, item.qty + 1);
    }));
    qsa('.qty-decr').forEach(b => b.addEventListener('click', e => {
      const name = e.currentTarget.dataset.name;
      const item = cart.find(i => i.name === name);
      if(item) updateQty(name, item.qty - 1);
    }));
    qsa('.remove-btn').forEach(b => b.addEventListener('click', e => {
      const name = e.currentTarget.dataset.name;
      removeFromCart(name);
    }));

    cartTotalEl.textContent = formatCurrency(getTotal());
  }

  // Drawer controls
  function openCart(){
    cartDrawer.classList.add('open');
    overlay.hidden = false;
    overlay.classList.add('visible');
    cartDrawer.setAttribute('aria-hidden', 'false');
  }
  function closeCartDrawer(){
    cartDrawer.classList.remove('open');
    overlay.classList.remove('visible');
    // hide overlay after transition
    setTimeout(()=> overlay.hidden = true, 300);
    cartDrawer.setAttribute('aria-hidden', 'true');
  }

  cartBtn.addEventListener('click', () => {
    openCart();
  });
  closeCart.addEventListener('click', closeCartDrawer);
  overlay.addEventListener('click', closeCartDrawer);

  // Sample checkout click (demo)
  checkoutBtn.addEventListener('click', () => {
    if(cart.length === 0){
      alert('Your cart is empty.');
      return;
    }
    // In production you'd connect to a backend/checkout API here.
    alert(`Demo checkout — Total: ${formatCurrency(getTotal())}\n(Implement real checkout to proceed.)`);
  });

  // Simple html escape for names used in attributes
  function escapeHtml(str){
    return String(str).replace(/[&<>"'`=\/]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','/':'&#x2F;','`':'&#x60;','=':'&#x3D;'}[s]));
  }

})();
