/* ----- Helpers ----- */
const $ = (q, ctx=document) => ctx.querySelector(q);
const $$ = (q, ctx=document) => [...ctx.querySelectorAll(q)];

const cart = [];
const fmt = v => `₹${v}`;

/* ----- Navbar / Mobile ----- */
const mobileToggle = $("#mobileToggle");
const menu = $("#menu");
mobileToggle?.addEventListener("click", () => menu.classList.toggle("show"));

/* ----- Year ----- */
$("#year").textContent = new Date().getFullYear();

/* ----- Search filter ----- */
const search = $("#search");
search?.addEventListener("input", e => {
  const term = e.target.value.toLowerCase().trim();
  $$("#cards .card").forEach(card => {
    const name = card.dataset.name.toLowerCase();
    card.style.display = name.includes(term) ? "" : "none";
  });
});

/* ----- Category chips ----- */
const chips = $$(".chip");
chips.forEach(chip => chip.addEventListener("click", () => {
  chips.forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  const cat = chip.dataset.filter;
  $$("#cards .card").forEach(card => {
    card.style.display = (cat === "all" || card.dataset.category === cat) ? "" : "none";
  });
}));

/* ----- Add to Cart ----- */
const updateCartUI = () => {
  const list = $("#cartItems");
  list.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    total += item.price * item.qty;
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name}</span>
      <div class="qty">
        <button aria-label="Decrease">−</button>
        <strong>${item.qty}</strong>
        <button aria-label="Increase">+</button>
        <strong style="width:70px;text-align:right">${fmt(item.price*item.qty)}</strong>
        <button class="btn icon" aria-label="Remove">🗑️</button>
      </div>
    `;
    const [dec, , inc, , removeBtn] = li.querySelectorAll("button, strong");
    dec.addEventListener("click", () => { if(item.qty>1){ item.qty--; refresh(); }});
    inc.addEventListener("click", () => { item.qty++; refresh(); });
    removeBtn.addEventListener("click", () => { cart.splice(i,1); refresh(); });
    list.appendChild(li);
  });

  $("#cartTotal").textContent = fmt(total);
  $("#cartCount").textContent = cart.reduce((n,i)=>n+i.qty,0);
};

const refresh = () => updateCartUI();

$$(".add").forEach(btn => {
  btn.addEventListener("click", e => {
    const card = e.target.closest(".card");
    const name = card.dataset.name;
    const price = Number(card.dataset.price);
    const existing = cart.find(i => i.name === name);
    if(existing) existing.qty++;
    else cart.push({ name, price, qty:1 });
    refresh();
    openCart();
  });
});

/* ----- Cart Drawer open/close ----- */
const cartDrawer = $("#cartDrawer");
const backdrop = $("#backdrop");
const openCart = () => {
  cartDrawer.classList.add("open");
  backdrop.classList.add("show");
};
const closeCart = () => {
  cartDrawer.classList.remove("open");
  backdrop.classList.remove("show");
};
$("#cartBtn").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
backdrop.addEventListener("click", closeCart);

/* ----- Checkout ----- */
$("#checkout").addEventListener("click", () => {
  if(cart.length === 0){ alert("Your cart is empty."); return; }
  const summary = cart.map(i => `${i.qty} × ${i.name}`).join(", ");
  alert(`Thanks for your order!\n\nItems: ${summary}\nTotal: ${$("#cartTotal").textContent}\n\n(Connect to a payment gateway to accept payments.)`);
  cart.length = 0;
  refresh();
  closeCart();
});

/* ----- Contact form (demo) 
$("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  alert("Thanks! We will contact you soon.");
  e.target.reset();
}); ----- */




/* ----- Side Menu ----- */




 const sideToggle = document.getElementById("sideToggle");
  const sideMenu = document.getElementById("sideMenu");
  const sideBackdrop = document.getElementById("sideBackdrop");
  const sideClose = document.getElementById("sideClose");

  // Open menu
  sideToggle.addEventListener("click", () => {
    sideMenu.classList.add("open");
    sideBackdrop.classList.add("show");
  });

  // Close menu with cross
  sideClose.addEventListener("click", () => {
    sideMenu.classList.remove("open");
    sideBackdrop.classList.remove("show");
  });

  // Close menu with backdrop
  sideBackdrop.addEventListener("click", () => {
    sideMenu.classList.remove("open");
    sideBackdrop.classList.remove("show");
  });




  const openBtn = document.getElementById('openChat');
    const closeBtn = document.getElementById('closeChat');
    const box = document.getElementById('chatBox');
    const messages = document.getElementById('messages');
    const input = document.getElementById('input');
    const sendBtn = document.getElementById('sendBtn');

    // Helpers
    const now = () => new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    const el = (tag, cls, txt) => { const e=document.createElement(tag); if(cls) e.className=cls; if(txt) e.textContent=txt; return e; };
    const scrollToEnd = () => messages.scrollTop = messages.scrollHeight;

    function addMsg(text, who='bot'){ const m=el('div',`msg ${who}`); m.innerHTML = text + `<small>${now()}</small>`; messages.appendChild(m); scrollToEnd(); }

    function typing(on=true){
      let t = document.getElementById('typing');
      if(on){ if(t) return; t = el('div','msg bot'); t.id='typing'; t.innerHTML = `<div class="typing"><span></span><span></span><span></span></div>`; messages.appendChild(t); }
      else if(t){ t.remove(); }
      scrollToEnd();
    }

    // Simple rule-based bot
    function botReply(text){
      const msg = text.trim().toLowerCase();
      // intent detection
      if(/^(hi|hello|hey)\b/.test(msg)) return `Hi! I'm your FoodieHub assistant. Try: <b>menu</b>, <b>offers</b>, <b>track</b>, <b>hours</b>, or <b>contact</b>.`;
      if(/menu|pizza|burger|pasta/.test(msg)) return `Our popular items:\n• Margherita Pizza – ₹199\n• Double Cheese Burger – ₹149\n• White Sauce Pasta – ₹179\nType <b>offers</b> to see today's deals.`.replace(/\n/g,'<br>');
      if(/offer|deal|discount/.test(msg)) return `🔥 Today: <b>Buy 1 Get 1</b> on classic pizzas after 6PM. Use code <b>FOODIE50</b> for 50% off (max ₹120).`;
      if(/hours|time|open|close/.test(msg)) return `We're open <b>10:00 AM – 11:00 PM</b> every day.`;
      if(/contact|phone|help/.test(msg)) return `You can call us at <b>+91 75892 57875</b> or email <b>support@foodiehub.example</b>.`;
      if(/track|order/.test(msg)) return `Enter your Order ID like <code>FH12345</code> and I'll track it for you.`;
      if(/^fh\d{5}\b/.test(msg)){
        const steps = ["Order confirmed","Being prepared","On the way","Delivered"];
        const idx = (msg.charCodeAt(2) + msg.charCodeAt(3)) % steps.length; // fake status
        return `Status for <b>${text}</b>: <b>${steps[idx]}</b>. ETA ~ 20–30 mins.`;
      }
      if(/thank/.test(msg)) return `You're welcome! Anything else?`;
      return `Sorry, I didn't get that. Try: <b>menu</b>, <b>offers</b>, <b>track</b>, <b>hours</b>, <b>contact</b>.`;
    }

    function quickChips(){
      const wrap = el('div');
      wrap.className = 'chips';
      ['Menu','Offers','Track','Hours','Contact'].forEach(label=>{
        const c = el('button','chip',label);
        c.addEventListener('click',()=>{
          input.value = label; send();
        });
        wrap.appendChild(c);
      });
      return wrap.outerHTML;
    }

    function send(){
      const text = input.value.trim();
      if(!text) return;
      addMsg(text,'user');
      input.value=''; input.focus();
      typing(true);
      setTimeout(()=>{
        typing(false);
        addMsg(botReply(text),'bot');
      }, 550);
    }

    // UI wiring
    openBtn.addEventListener('click',()=>{ box.classList.add('open'); input.focus(); if(!messages.dataset.greeted){ addMsg(`Hello! I'm <b>FoodieHub Bot</b> 🤖<br>How can I help today?${quickChips()}`); messages.dataset.greeted = '1'; } });
    closeBtn.addEventListener('click',()=> box.classList.remove('open'));
    sendBtn.addEventListener('click',send);
    input.addEventListener('keydown',e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(); }});