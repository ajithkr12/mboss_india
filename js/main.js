/* ============================================================
   MBOSS LEXON LLP — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initFAQ();
  initScrollTop();
  initMobileMenu();
  initCounters();
  initFormHandlers();
  setActiveNavLink();
  initMobileSubmenus();
  // Skip on first visit — the video intro will replay it after transition
  if (sessionStorage.getItem('disclaimerAccepted')) initHeroTyping();
  initHeroChat();
  initHeroBgVideo();
});

/* ============================================================
   Hero Background Video (responsive)
   ============================================================ */
function initHeroBgVideo() {
  const video = document.getElementById('hero-bg-video');
  if (!video) return;

  const DESKTOP = 'assets/indroduse_desktop.mp4';
  const MOBILE  = 'assets/indroduse_mobile.mp4';
  let current   = null;

  function loadSrc() {
    const src = window.innerWidth >= 768 ? DESKTOP : MOBILE;
    if (src === current) return;
    current = src;
    video.src = src;
    video.load();
    video.play().catch(function () {});
  }

  loadSrc();

  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(loadSrc, 300);
  }, { passive: true });
}

/* Navbar scroll effect */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* Intersection Observer scroll reveal */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

/* FAQ accordion */
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
}

/* Scroll-to-top button */
function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 500), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* Mobile menu toggle */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.querySelector('.mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';

    const [a, b, c] = toggle.querySelectorAll('span');
    if (open) {
      a.style.cssText = 'transform:rotate(45deg) translate(5px,5px)';
      b.style.cssText = 'opacity:0';
      c.style.cssText = 'transform:rotate(-45deg) translate(5px,-5px)';
    } else {
      [a, b, c].forEach(s => (s.style.cssText = ''));
    }
  });

  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !menu.contains(e.target) && menu.classList.contains('open')) {
      menu.classList.remove('open');
      document.body.style.overflow = '';
      toggle.querySelectorAll('span').forEach(s => (s.style.cssText = ''));
    }
  });
}

/* Mobile sub-menus */
function initMobileSubmenus() {
  document.querySelectorAll('.mobile-submenu-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const sub  = btn.nextElementSibling;
      const icon = btn.querySelector('.toggle-icon');
      const open = sub.classList.toggle('open');
      if (icon) icon.textContent = open ? '−' : '+';
    });
  });
}

/* Animated counters */
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  els.forEach(el => obs.observe(el));
}

function animateCount(el) {
  const target   = parseInt(el.dataset.count, 10);
  const suffix   = el.dataset.suffix || '';
  const duration = 2000;
  const step     = target / (duration / 16);
  let current    = 0;
  const tick = () => {
    current = Math.min(current + step, target);
    el.textContent = Math.round(current) + suffix;
    if (current < target) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* Contact / Newsletter forms */
function initFormHandlers() {
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = '✓ Message Sent';
        btn.style.background = '#10B981';
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.background = '';
          btn.disabled = false;
          form.reset();
        }, 3000);
      }, 1400);
    });
  }

  document.querySelectorAll('.newsletter-form').forEach(f => {
    f.addEventListener('submit', e => {
      e.preventDefault();
      const btn = f.querySelector('button');
      btn.textContent = '✓ Subscribed';
      setTimeout(() => { btn.textContent = 'Subscribe'; f.reset(); }, 2500);
    });
  });
}

/* Highlight active nav link */
function setActiveNavLink() {
  const path = window.location.pathname.replace(/\/$/, '');

  document.querySelectorAll('.nav-link, .mobile-nav-link, .dropdown-item, .mobile-submenu a').forEach(a => {
    if (!a.href) return;
    const rawHref = a.getAttribute('href');
    if (!rawHref || rawHref === '#' || rawHref.startsWith('#')) return;
    const href = new URL(a.href, location.origin).pathname.replace(/\/$/, '');
    if (href && path.endsWith(href) && href !== '') a.classList.add('active');
  });

  /* If a dropdown child item is active, also mark the parent toggle active */
  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    const hasActiveChild = dropdown.querySelector('.dropdown-item.active, .mobile-submenu a.active');
    if (hasActiveChild) {
      const toggle = dropdown.querySelector('.nav-dropdown-toggle');
      if (toggle) toggle.classList.add('active');
    }
  });
}

/* Smooth anchor scroll */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const target = document.querySelector(a.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 80;
  window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - offset, behavior: 'smooth' });
});

/* ============================================================
   Hero Typing Animation
   ============================================================ */
function initHeroTyping() {
  const subtitleEl = document.getElementById('hero-subtitle-typed');
  const descEl     = document.getElementById('hero-desc-typed');
  const trigger    = document.getElementById('hero-chat-trigger');
  if (!subtitleEl || !descEl) return;

  const subtitleText = 'Strategic Legal Solutions for Businesses, Corporates, Startups & Financial Institutions';
  const descText     = 'MBOSS Lexon LLP is a technology-enabled legal services firm delivering precise, practical and business-focused legal solutions across corporate law, banking & finance, commercial advisory and regulatory compliance.';

  // Type characters one by one into an element, call done() when finished
  function typeInto(el, text, speed, done) {
    el.classList.add('hero-typing-cursor');
    let i = 0;
    function tick() {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(tick, speed + Math.random() * 8);
      } else {
        el.classList.remove('hero-typing-cursor');
        if (done) done();
      }
    }
    tick();
  }

  // Start subtitle typing after a short delay, then chain to description
  setTimeout(function () {
    typeInto(subtitleEl, subtitleText, 10, function () {
      setTimeout(function () {
        typeInto(descEl, descText, 8, function () {
          // Reveal the chat trigger after both sentences finish
          setTimeout(function () {
            trigger.style.display = 'inline-flex';
            trigger.style.opacity = '0';
            trigger.style.transition = 'opacity 0.5s';
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                trigger.style.opacity = '1';
              });
            });
          }, 300);
        });
      }, 400);
    });
  }, 600);
}

/* ============================================================
   Hero Chat Popup
   ============================================================ */
function initHeroChat() {
  const trigger  = document.getElementById('hero-chat-trigger');
  const popup    = document.getElementById('hero-chat-popup');
  const closeBtn = document.getElementById('hcp-close');
  const skipBtn  = document.getElementById('hcp-skip');
  const input    = document.getElementById('hcp-input');
  const sendBtn  = document.getElementById('hcp-send');
  const body     = document.getElementById('hcp-body');
  if (!trigger || !popup) return;

  let overlay = null;

  // Create full-screen blur overlay
  function createOverlay() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'hcp-overlay';
    overlay.addEventListener('click', closeChat);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
  }

  function removeOverlay() {
    if (!overlay) return;
    overlay.classList.add('hcp-overlay-out');
    setTimeout(function () {
      if (overlay && overlay.parentNode) overlay.remove();
      overlay = null;
      document.body.style.overflow = '';
    }, 250);
  }

  // Open popup with overlay
  function openChat() {
    createOverlay();
    popup.style.display = 'flex';
    popup.classList.remove('hcp-closing');
    setTimeout(function () { if (input) input.focus(); }, 120);
  }

  // Close popup + overlay with animation
  function closeChat() {
    popup.classList.add('hcp-closing');
    removeOverlay();
    setTimeout(function () {
      popup.style.display = 'none';
      popup.classList.remove('hcp-closing');
    }, 240);
  }

  trigger.addEventListener('click', openChat);
  trigger.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openChat(); }
  });
  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && popup.style.display === 'flex') closeChat();
  });
  if (closeBtn) closeBtn.addEventListener('click', closeChat);

  // Skip to main window: close popup and scroll to hero actions
  if (skipBtn) {
    skipBtn.addEventListener('click', function () {
      closeChat();
      setTimeout(function () {
        const target = document.querySelector('.hero-actions') || document.querySelector('#about');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 260);
    });
  }

  // Send message
  function sendMessage() {
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();
    input.value = '';
    appendBubble(text, 'user');
    showTypingThenReply(text);
  }

  if (sendBtn) sendBtn.addEventListener('click', sendMessage);
  if (input) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') sendMessage();
    });
  }

  // Append a chat bubble
  function appendBubble(text, who) {
    const wrap = document.createElement('div');
    wrap.className = 'hcp-bubble hcp-bubble-' + who;
    const p = document.createElement('p');
    p.textContent = text;
    const time = document.createElement('span');
    time.className = 'hcp-time';
    time.textContent = 'Just now';
    wrap.appendChild(p);
    wrap.appendChild(time);
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
    return wrap;
  }

  // Show typing indicator then an auto-reply
  function showTypingThenReply(userMsg) {
    // Typing indicator
    const typing = document.createElement('div');
    typing.className = 'hcp-bubble hcp-bubble-bot hcp-typing';
    const typingP = document.createElement('p');
    ['','',''].forEach(function () {
      const dot = document.createElement('span');
      dot.className = 'hcp-typing-dot';
      typingP.appendChild(dot);
    });
    typing.appendChild(typingP);
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;

    setTimeout(function () {
      body.removeChild(typing);
      const reply = getAutoReply(userMsg);
      appendBubble(reply, 'bot');
    }, 1400 + Math.random() * 800);
  }

  // Simple keyword-based auto-replies
  function getAutoReply(msg) {
    const m = msg.toLowerCase();
    if (/consult|appointment|book|meet/.test(m))
      return 'You can book a consultation at our Contact page or call us directly. Our team typically responds within 48 hours.';
    if (/startup|msme|incorporat/.test(m))
      return 'We specialise in startup legal advisory — incorporation, DPIIT recognition, ESOP structuring and founder agreements. Happy to help!';
    if (/bank|finance|npa|sarfaesi/.test(m))
      return 'Our banking & finance team handles loan documentation, NPA recovery and SARFAESI proceedings. Please share more details and we will get back to you.';
    if (/ip|trademark|copyright|patent/.test(m))
      return 'We handle trademark registration, copyright protection and IP licensing. Would you like to schedule a call with our IP team?';
    if (/privacy|data|dpdp|cyber/.test(m))
      return 'We advise on DPDP Act 2023 compliance, privacy policies and data processing agreements. Reach out for a detailed consultation.';
    if (/contract|draft|nda|mou/.test(m))
      return 'Our team can draft and review NDAs, MoUs, vendor agreements and commercial contracts. Let us know what you need!';
    if (/fee|cost|charge|price/.test(m))
      return 'Our fees depend on the scope and complexity of the matter. Please book a free initial consultation and we will provide a transparent quote.';
    if (/location|office|address|kochi|kerala/.test(m))
      return 'We have offices in Kochi, Trivandrum and Kozhikode, and serve clients pan-India with remote advisory.';
    return 'Thank you for reaching out to MBOSS Lexon LLP! Please share more details or visit our Contact page and our team will respond within 48 hours.';
  }
}

/* Schema injection helper – call from page if needed */
function injectSchema(obj) {
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(obj, null, 2);
  document.head.appendChild(s);
}
window.injectSchema = injectSchema;

/* ============================================================
   Practice Areas – Mobile Slider (sticky scroll, bottom-to-top)
   Each card advances as you scroll through the section buffer.
   Desktop grid layout is completely untouched.
   ============================================================ */
(function () {
  var section = document.getElementById('practice-areas');
  if (!section) return;

  var grid = section.querySelector('.grid');
  if (!grid) return;

  var srcCards = Array.from(grid.querySelectorAll('.practice-card'));
  var total = srcCards.length;

  var scrollBuf = null;   // tall wrapper that provides scroll room
  var slider    = null;   // the slider DOM node appended into section
  var wraps     = [];
  var currentIdx = 0;
  var isAnimating = false;

  /* ---- build ------------------------------------------------ */
  function build() {
    if (slider) return;

    // 1. Hide original grid
    grid.style.display = 'none';

    // 2. Wrap section in a tall scroll-buffer div so the section
    //    can be position:sticky while the user scrolls through it.
    //    Buffer height = section height (100vh) + 55vh per extra card.
    scrollBuf = document.createElement('div');
    scrollBuf.className = 'pm-scroll-buf';
    scrollBuf.style.height = (100 + (total - 1) * 55) + 'vh';
    section.parentNode.insertBefore(scrollBuf, section);
    scrollBuf.appendChild(section);
    section.classList.add('pm-sticky');

    // 3. Build slider UI
    slider = document.createElement('div');
    slider.className = 'pm-slider';

    // Key highlights injected into each mobile card (desktop cards untouched)
    var cardHighlights = [
      ['M&A Advisory', 'Corporate Governance', 'Shareholder Agreements'],
      ['SARFAESI Proceedings', 'NPA Recovery', 'Loan Documentation'],
      ['NDA & MoU Drafting', 'Vendor Agreements', 'Service Contracts'],
      ['DPIIT Recognition', 'ESOP Structuring', 'Fundraising Docs'],
      ['Regulatory Licensing', 'Statutory Filings', 'Compliance Advisory'],
      ['Trademark Registration', 'Copyright Protection', 'IP Licensing'],
      ['Civil Litigation', 'Commercial Recovery', 'Tribunal Representation'],
      ['Arbitration', 'Mediation', 'Conciliation'],
      ['Title Verification', 'Sale Deeds', 'Lease Documentation'],
      ['Employment Agreements', 'HR Policy Drafting', 'Dispute Management'],
      ['DPDP Act 2023', 'Privacy Policies', 'Data Processing Agreements'],
      ['Document Review', 'Contract Management', 'Compliance Monitoring'],
    ];

    var stage = document.createElement('div');
    stage.className = 'pm-stage';

    wraps = srcCards.map(function (card, i) {
      var wrap = document.createElement('div');
      wrap.className = 'pm-card-wrap' + (i === 0 ? ' pm-static' : '');
      var clone = card.cloneNode(true);
      clone.classList.remove('reveal', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3');
      clone.classList.add('visible');

      // Inject highlights list into the cloned card
      var hl = cardHighlights[i] || [];
      if (hl.length) {
        var divider = document.createElement('div');
        divider.className = 'pm-card-divider';
        clone.insertBefore(divider, clone.querySelector('.card-link'));

        var ul = document.createElement('ul');
        ul.className = 'pm-card-hl';
        hl.forEach(function (text) {
          var li = document.createElement('li');
          li.innerHTML = '<i class="fas fa-check-circle"></i><span>' + text + '</span>';
          ul.appendChild(li);
        });
        clone.insertBefore(ul, clone.querySelector('.card-link'));
      }

      wrap.appendChild(clone);
      stage.appendChild(wrap);
      return wrap;
    });

    // Counter: "1 / 12"
    var counter = document.createElement('div');
    counter.className = 'pm-counter';
    counter.innerHTML = '<span class="pm-curr">1</span><span class="pm-sep"> / ' + total + '</span>';

    slider.appendChild(stage);
    slider.appendChild(counter);
    section.querySelector('.container').appendChild(slider);

    // Touch swipe (supplement to scroll)
    var touchY = 0;
    stage.addEventListener('touchstart', function (e) {
      touchY = e.touches[0].clientY;
    }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      var dy = touchY - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 44) goTo(dy > 0 ? currentIdx + 1 : currentIdx - 1);
    }, { passive: true });

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- goTo ------------------------------------------------- */
  function goTo(idx) {
    if (isAnimating) return;
    idx = Math.max(0, Math.min(total - 1, idx));
    if (idx === currentIdx) return;

    isAnimating = true;
    var dir  = idx > currentIdx ? 1 : -1;
    var curr = wraps[currentIdx];
    var next = wraps[idx];

    [curr, next].forEach(function (w) {
      w.classList.remove('pm-static', 'pm-exit-up', 'pm-exit-down', 'pm-enter-bottom', 'pm-enter-top');
    });

    curr.style.zIndex = '1';
    next.style.zIndex = '2';
    curr.classList.add(dir > 0 ? 'pm-exit-up'      : 'pm-exit-down');
    next.classList.add(dir > 0 ? 'pm-enter-bottom'  : 'pm-enter-top');

    // Update counter
    var el = slider.querySelector('.pm-curr');
    if (el) el.textContent = idx + 1;

    setTimeout(function () {
      curr.classList.remove('pm-exit-up', 'pm-exit-down');
      curr.style.zIndex = '';
      next.classList.remove('pm-enter-bottom', 'pm-enter-top');
      next.classList.add('pm-static');
      next.style.zIndex = '';
      currentIdx = idx;
      isAnimating = false;
    }, 460);
  }

  /* ---- onScroll --------------------------------------------- */
  // Map scroll progress through the buffer to a card index.
  function onScroll() {
    if (!scrollBuf) return;
    var bufH  = scrollBuf.offsetHeight;
    var vh    = window.innerHeight;
    var bufTop = scrollBuf.getBoundingClientRect().top;
    // How far we've scrolled INTO the buffer (px)
    var scrolled = -bufTop;
    // Total scrollable range = bufH - vh (section height)
    var maxScroll = bufH - vh;
    if (maxScroll <= 0) return;
    var progress = Math.max(0, Math.min(1, scrolled / maxScroll));
    // Map to card index; clamp to total-1
    var newIdx = Math.min(total - 1, Math.floor(progress * total));
    if (newIdx !== currentIdx) goTo(newIdx);
  }

  /* ---- teardown --------------------------------------------- */
  function teardown() {
    if (!slider) return;
    window.removeEventListener('scroll', onScroll);

    // Restore DOM: move section back before the buffer, remove buffer
    if (scrollBuf && scrollBuf.parentNode) {
      scrollBuf.parentNode.insertBefore(section, scrollBuf);
      scrollBuf.remove();
    }
    scrollBuf = null;
    section.classList.remove('pm-sticky');

    slider.remove();
    slider = null;
    wraps = [];
    currentIdx = 0;
    isAnimating = false;
    grid.style.display = '';
  }

  /* ---- init ------------------------------------------------- */
  function check() {
    if (window.innerWidth <= 768) build();
    else teardown();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', check);
  } else {
    check();
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(check, 200);
  });
})();
