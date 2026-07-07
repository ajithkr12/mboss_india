/* ============================================================
   MBOSS LEXON LLP — Main JavaScript
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initScrollReveal();
  initFAQ();
  initScrollTop();
  initMobileMenu();
  initCounters();
  initFormHandlers();
  initInternshipFormHandler();
  setActiveNavLink();
  initMobileSubmenus();
  initTeamBioToggles();
  initInternshipModal();
  // Skip on first visit — the video intro will replay it after transition
  if (sessionStorage.getItem("disclaimerAccepted")) initHeroTyping();
  initHeroChat();
  initHeroBgVideo();
});

/* ============================================================
   Hero Background Video (responsive)
   ============================================================ */
function initHeroBgVideo() {
  const video = document.getElementById("hero-bg-video");
  if (!video) return;

  const DESKTOP = "assets/indroduse_desktop.webm";
  const MOBILE = "assets/indroduse_mobile.webm";
  let current = null;

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
  window.addEventListener(
    "resize",
    function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(loadSrc, 300);
    },
    { passive: true },
  );
}

/* Navbar scroll effect */
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  const onScroll = () =>
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* Intersection Observer scroll reveal */
function initScrollReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
  );
  els.forEach((el) => obs.observe(el));
}

/* FAQ accordion */
function initFAQ() {
  document.querySelectorAll(".faq-question").forEach((q) => {
    q.addEventListener("click", () => {
      const item = q.closest(".faq-item");
      const isActive = item.classList.contains("active");
      document
        .querySelectorAll(".faq-item")
        .forEach((i) => i.classList.remove("active"));
      if (!isActive) item.classList.add("active");
    });
  });
}

/* Scroll-to-top button */
function initScrollTop() {
  const btn = document.querySelector(".scroll-top");
  if (!btn) return;
  window.addEventListener(
    "scroll",
    () => btn.classList.toggle("visible", window.scrollY > 500),
    { passive: true },
  );
  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
}

/* Mobile menu toggle */
function initMobileMenu() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".mobile-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";

    const [a, b, c] = toggle.querySelectorAll("span");
    if (open) {
      a.style.cssText = "transform:rotate(45deg) translate(5px,5px)";
      b.style.cssText = "opacity:0";
      c.style.cssText = "transform:rotate(-45deg) translate(5px,-5px)";
    } else {
      [a, b, c].forEach((s) => (s.style.cssText = ""));
    }
  });

  document.addEventListener("click", (e) => {
    if (
      !toggle.contains(e.target) &&
      !menu.contains(e.target) &&
      menu.classList.contains("open")
    ) {
      menu.classList.remove("open");
      document.body.style.overflow = "";
      toggle.querySelectorAll("span").forEach((s) => (s.style.cssText = ""));
    }
  });
}

/* Mobile sub-menus */
function initMobileSubmenus() {
  document.querySelectorAll(".mobile-submenu-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sub = btn.nextElementSibling;
      const icon = btn.querySelector(".toggle-icon");
      const open = sub.classList.toggle("open");
      if (icon) icon.textContent = open ? "−" : "+";
    });
  });
}

/* Team member details modal */
function initTeamBioToggles() {
  const overlay = document.getElementById("team-modal-overlay");
  if (!overlay) return;

  const box = overlay.querySelector(".team-modal-box");
  const closeBtn = overlay.querySelector(".team-modal-close");
  const modalPhoto = document.getElementById("team-modal-photo");
  const modalName = document.getElementById("team-modal-name");
  const modalDesignation = document.getElementById("team-modal-designation");
  const modalPractice = document.getElementById("team-modal-practice");
  const modalBio = document.getElementById("team-modal-bio");
  let lastFocused = null;

  function openModal(card) {
    const photo = card.querySelector(".team-card-photo img");
    const name = card.querySelector("h3");
    const designation = card.querySelector(".team-designation");
    const practice = card.querySelector(".team-practice");
    const bio = card.querySelector(".team-bio");

    modalPhoto.src = photo ? photo.src : "";
    modalPhoto.alt = photo ? photo.alt : "";
    modalName.textContent = name ? name.textContent : "";
    modalDesignation.textContent = designation ? designation.textContent : "";
    modalPractice.textContent = practice ? practice.textContent : "";
    modalPractice.style.display = practice ? "" : "none";
    modalBio.innerHTML = bio ? bio.innerHTML : "";

    lastFocused = document.activeElement;
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll(".team-bio-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".team-card");
      if (card) openModal(card);
    });
  });

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (!box.contains(e.target)) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
  });
}

/* Animated counters */
function initCounters() {
  const els = document.querySelectorAll("[data-count]");
  if (!els.length) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCount(e.target);
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 },
  );
  els.forEach((el) => obs.observe(el));
}

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || "";
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const tick = () => {
    current = Math.min(current + step, target);
    el.textContent = Math.round(current) + suffix;
    if (current < target) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ── Google Apps Script endpoint ──────────────────────────────
   Deploy your Apps Script as a web app (Execute as: Me,
   Who has access: Anyone) and paste the /exec URL here.
   ──────────────────────────────────────────────────────────── */
// const CONTACT_SCRIPT_URL =
//   "https://script.google.com/macros/s/AKfycbxRAtWRCSDDST4FhneQlI2z980C8KuTFDF1UJHVMYb9TKV6F8gx6lskV0NyKXfbSq2f/exec";
CONTACT_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbylTY-Du-h-5vJQbddJ_onRyHL2HjWES9UV_Rt0wgOlb4Ex3EntiXbpxPGHjRBl2lRhVg/exec";
/* Contact / Newsletter forms */
function initFormHandlers() {
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Field refs
      const nameEl = form.querySelector("#name");
      const emailEl = form.querySelector("#email");
      const serviceEl = form.querySelector("#service");
      const msgEl = form.querySelector("#message");

      // Client-side validation
      if (
        !nameEl.value.trim() ||
        !emailEl.value.trim() ||
        !serviceEl.value ||
        !msgEl.value.trim()
      ) {
        showFormStatus(form, "Please fill in all required fields.", "error");
        return;
      }

      const btn = form.querySelector('[type="submit"]');
      const origHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
      btn.disabled = true;
      clearFormStatus(form);

      const payload = JSON.stringify({
        name: nameEl.value.trim(),
        email: emailEl.value.trim(),
        phone: (form.querySelector("#phone") || {}).value || "",
        company: (form.querySelector("#company") || {}).value || "",
        service: serviceEl.value,
        message: msgEl.value.trim(),
      });

      try {
        await fetch(CONTACT_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" },
          body: payload,
        });

        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent';
        btn.style.background = "#10B981";
        showFormStatus(
          form,
          "Your message has been sent. Our team will respond within 48 business hours.",
          "success",
        );
        form.reset();

        setTimeout(() => {
          btn.innerHTML = origHTML;
          btn.style.background = "";
          btn.disabled = false;
        }, 4000);
      } catch (_) {
        btn.innerHTML = origHTML;
        btn.disabled = false;
        showFormStatus(
          form,
          "Something went wrong. Please try again or email us at info@mbosslexon.com",
          "error",
        );
      }
    });
  }

  document.querySelectorAll(".newsletter-form").forEach((f) => {
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = f.querySelector("button");
      btn.textContent = "✓ Subscribed";
      setTimeout(() => {
        btn.textContent = "Subscribe";
        f.reset();
      }, 2500);
    });
  });
}

/* Internship application modal */
function initInternshipModal() {
  const overlay = document.getElementById("internship-modal-overlay");
  if (!overlay) return;

  const box = overlay.querySelector(".internship-modal-box");
  const closeBtn = overlay.querySelector(".internship-modal-close");
  let lastFocused = null;

  function openModal(e) {
    if (e) e.preventDefault();
    lastFocused = document.activeElement;
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll("[data-open-internship-modal]").forEach((el) => {
    el.addEventListener("click", openModal);
  });

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (!box.contains(e.target)) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
  });
}

/* Internship application form (CV upload) */
const MAX_CV_SIZE = 5 * 1024 * 1024; // 5MB

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1] || "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function initInternshipFormHandler() {
  const form = document.querySelector(".internship-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameEl = form.querySelector("#i-name");
    const emailEl = form.querySelector("#i-email");
    const phoneEl = form.querySelector("#i-phone");
    const programmeEl = form.querySelector("#i-programme");
    const msgEl = form.querySelector("#i-message");
    const cvEl = form.querySelector("#i-cv");
    const cvFile = cvEl.files[0];

    if (
      !nameEl.value.trim() ||
      !emailEl.value.trim() ||
      !phoneEl.value.trim() ||
      !programmeEl.value ||
      !msgEl.value.trim() ||
      !cvFile
    ) {
      showFormStatus(
        form,
        "Please fill in all required fields and attach your CV.",
        "error",
      );
      return;
    }

    if (!/\.(pdf|doc|docx)$/i.test(cvFile.name)) {
      showFormStatus(
        form,
        "CV must be a PDF or Word document (.pdf, .doc, .docx).",
        "error",
      );
      return;
    }

    if (cvFile.size > MAX_CV_SIZE) {
      showFormStatus(
        form,
        "CV file is too large. Please upload a file under 5MB.",
        "error",
      );
      return;
    }

    const btn = form.querySelector('[type="submit"]');
    const origHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting…';
    btn.disabled = true;
    clearFormStatus(form);

    try {
      const cvBase64 = await fileToBase64(cvFile);

      const payload = JSON.stringify({
        formType: "internship",
        name: nameEl.value.trim(),
        email: emailEl.value.trim(),
        phone: phoneEl.value.trim(),
        programme: programmeEl.value,
        college: (form.querySelector("#i-college") || {}).value || "",
        message: msgEl.value.trim(),
        cvFileName: cvFile.name,
        cvMimeType: cvFile.type || "application/octet-stream",
        cvBase64: cvBase64,
      });

      await fetch(CONTACT_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: payload,
      });

      btn.innerHTML = '<i class="fas fa-check"></i> Application Sent';
      btn.style.background = "#10B981";
      showFormStatus(
        form,
        "Your application has been submitted. Our team will review it and get back to you.",
        "success",
      );
      form.reset();

      setTimeout(() => {
        btn.innerHTML = origHTML;
        btn.style.background = "";
        btn.disabled = false;

        const overlay = document.getElementById("internship-modal-overlay");
        if (overlay && overlay.classList.contains("open")) {
          overlay.classList.remove("open");
          document.body.style.overflow = "";
          clearFormStatus(form);
        }
      }, 2500);
    } catch (_) {
      btn.innerHTML = origHTML;
      btn.disabled = false;
      showFormStatus(
        form,
        "Something went wrong. Please try again or email your CV to career@mbosslexon.com",
        "error",
      );
    }
  });
}

function showFormStatus(form, msg, type) {
  let el = form.querySelector(".form-status");
  if (!el) {
    el = document.createElement("div");
    el.className = "form-status";
    form.appendChild(el);
  }
  el.textContent = msg;
  el.className = "form-status form-status-" + type;
}

function clearFormStatus(form) {
  const el = form.querySelector(".form-status");
  if (el) el.remove();
}

/* Highlight active nav link */
function setActiveNavLink() {
  const path = window.location.pathname.replace(/\/$/, "");

  document
    .querySelectorAll(
      ".nav-link, .mobile-nav-link, .dropdown-item, .mobile-submenu a",
    )
    .forEach((a) => {
      if (!a.href) return;
      const rawHref = a.getAttribute("href");
      if (!rawHref || rawHref === "#" || rawHref.startsWith("#")) return;
      const href = new URL(a.href, location.origin).pathname.replace(/\/$/, "");
      if (href && path.endsWith(href) && href !== "") a.classList.add("active");
    });

  /* If a dropdown child item is active, also mark the parent toggle active */
  document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
    const hasActiveChild = dropdown.querySelector(
      ".dropdown-item.active, .mobile-submenu a.active",
    );
    if (hasActiveChild) {
      const toggle = dropdown.querySelector(".nav-dropdown-toggle");
      if (toggle) toggle.classList.add("active");
    }
  });
}

/* Smooth anchor scroll */
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const target = document.querySelector(a.getAttribute("href"));
  if (!target) return;
  e.preventDefault();
  const offset =
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--navbar-height",
      ),
    ) || 80;
  window.scrollTo({
    top: target.getBoundingClientRect().top + scrollY - offset,
    behavior: "smooth",
  });
});

/* ============================================================
   Hero Typing Animation
   ============================================================ */
function initHeroTyping() {
  const subtitleEl = document.getElementById("hero-subtitle-typed");
  const descEl = document.getElementById("hero-desc-typed");
  const trigger = document.getElementById("hero-chat-trigger");
  if (!subtitleEl || !descEl) return;

  const subtitleText =
    "Strategic Legal Solutions for Businesses, Corporates, Startups & Financial Institutions";
  const descText =
    "MBOSS Lexon LLP is a technology-enabled legal services firm delivering precise, practical and business-focused legal solutions across corporate law, banking & finance, commercial advisory and regulatory compliance.";

  // Type characters one by one into an element, call done() when finished
  function typeInto(el, text, speed, done) {
    el.classList.add("hero-typing-cursor");
    let i = 0;
    function tick() {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(tick, speed + Math.random() * 8);
      } else {
        el.classList.remove("hero-typing-cursor");
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
            trigger.style.display = "inline-flex";
            trigger.style.opacity = "0";
            trigger.style.transition = "opacity 0.5s";
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                trigger.style.opacity = "1";
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
  const trigger = document.getElementById("hero-chat-trigger");
  const popup = document.getElementById("hero-chat-popup");
  const closeBtn = document.getElementById("hcp-close");
  const skipBtn = document.getElementById("hcp-skip");
  const input = document.getElementById("hcp-input");
  const sendBtn = document.getElementById("hcp-send");
  const body = document.getElementById("hcp-body");
  if (!trigger || !popup) return;

  let overlay = null;

  // Create full-screen blur overlay
  function createOverlay() {
    if (overlay) return;
    overlay = document.createElement("div");
    overlay.className = "hcp-overlay";
    overlay.addEventListener("click", closeChat);
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
  }

  function removeOverlay() {
    if (!overlay) return;
    overlay.classList.add("hcp-overlay-out");
    setTimeout(function () {
      if (overlay && overlay.parentNode) overlay.remove();
      overlay = null;
      document.body.style.overflow = "";
    }, 250);
  }

  // Open popup with overlay
  function openChat() {
    createOverlay();
    popup.style.display = "flex";
    popup.classList.remove("hcp-closing");
    setTimeout(function () {
      if (input) input.focus();
    }, 120);
  }

  // Close popup + overlay with animation
  function closeChat() {
    popup.classList.add("hcp-closing");
    removeOverlay();
    setTimeout(function () {
      popup.style.display = "none";
      popup.classList.remove("hcp-closing");
    }, 240);
  }

  trigger.addEventListener("click", openChat);
  trigger.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openChat();
    }
  });
  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && popup.style.display === "flex") closeChat();
  });
  if (closeBtn) closeBtn.addEventListener("click", closeChat);

  // Skip to main window: close popup and scroll to hero actions
  if (skipBtn) {
    skipBtn.addEventListener("click", function () {
      closeChat();
      setTimeout(function () {
        const target =
          document.querySelector(".hero-actions") ||
          document.querySelector("#about");
        if (target)
          target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 260);
    });
  }

  // Send message
  function sendMessage() {
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();
    input.value = "";
    appendBubble(text, "user");
    showTypingThenReply(text);
  }

  if (sendBtn) sendBtn.addEventListener("click", sendMessage);
  if (input) {
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") sendMessage();
    });
  }

  // Append a chat bubble
  function appendBubble(text, who) {
    const wrap = document.createElement("div");
    wrap.className = "hcp-bubble hcp-bubble-" + who;
    const p = document.createElement("p");
    p.textContent = text;
    const time = document.createElement("span");
    time.className = "hcp-time";
    time.textContent = "Just now";
    wrap.appendChild(p);
    wrap.appendChild(time);
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
    return wrap;
  }

  // Show typing indicator then an auto-reply
  function showTypingThenReply(userMsg) {
    // Typing indicator
    const typing = document.createElement("div");
    typing.className = "hcp-bubble hcp-bubble-bot hcp-typing";
    const typingP = document.createElement("p");
    ["", "", ""].forEach(function () {
      const dot = document.createElement("span");
      dot.className = "hcp-typing-dot";
      typingP.appendChild(dot);
    });
    typing.appendChild(typingP);
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;

    setTimeout(
      function () {
        body.removeChild(typing);
        const reply = getAutoReply(userMsg);
        appendBubble(reply, "bot");
      },
      1400 + Math.random() * 800,
    );
  }

  // Keyword-based auto-replies covering all practice areas and site content
  function getAutoReply(msg) {
    const m = msg.toLowerCase();

    // Greetings
    if (
      /^(hi|hello|hey|good\s*(morning|afternoon|evening)|namaste|hai)\b/.test(m)
    )
      return "Hello! Welcome to MBOSS Lexon LLP. I'm here to help you with any legal queries. What can I assist you with today?";

    // Booking / consultation
    if (/consult|appointment|book|meet|schedule|call us|reach/.test(m))
      return "You can book a free initial consultation by visiting our Contact page or calling us at +91 8129497999. Our team typically responds within 48 hours.";

    // Startup & MSME
    if (
      /startup|msme|incorporat|dpiit|ksum|esop|founder|seed|fundrais|investor|angel|venture/.test(
        m,
      )
    )
      return "We specialise in startup legal advisory — company and LLP incorporation, DPIIT recognition, KSUM support, ESOP structuring, founder agreements, term sheets and investor documentation. Book a consultation to get started!";

    // Banking & Finance
    if (
      /bank|nbfc|npa|sarfaesi|loan|lender|recovery|rbi|financial institution|debt|securit/.test(
        m,
      )
    )
      return "Our banking & finance team advises scheduled banks, NBFCs and financial institutions on loan documentation, security creation, NPA recovery, SARFAESI proceedings and RBI regulatory compliance. Share your details and we'll get back to you promptly.";

    // Corporate & Commercial Law
    if (
      /corporate|commercial law|merger|acquisition|m&a|joint venture|shareholder|board|due diligence|restructur/.test(
        m,
      )
    )
      return "MBOSS Lexon LLP handles a full spectrum of corporate and commercial law matters — M&A, joint ventures, shareholder agreements, board governance, corporate restructuring and due diligence. Visit our Corporate Law page for details.";

    // Contracts & Agreements
    if (
      /contract|draft|nda|mou|vendor|agreement|service agreement|review|clause/.test(
        m,
      )
    )
      return "Our team drafts and reviews commercial contracts including NDAs, MoUs, vendor agreements, service agreements and business contracts — all tailored to protect your interests and minimise risk.";

    // Intellectual Property
    if (
      /ip|trademark|copyright|patent|brand|design registr|trade secret|license|infring/.test(
        m,
      )
    )
      return "We handle trademark registration, copyright protection, patent advisory, IP licensing and infringement matters. Would you like to schedule a call with our IP team?";

    // Data Privacy & Cyber Law
    if (
      /privacy|data|dpdp|cyber|gdpr|personal data|data breach|information security|consent/.test(
        m,
      )
    )
      return "We advise on India's DPDP Act 2023, GDPR compliance, privacy policies, data processing agreements and cyber law matters. A consultation with our data privacy team can be arranged quickly.";

    // Litigation & Dispute Resolution
    if (
      /litigat|court|suit|dispute|claim|case|civil|criminal|high court|supreme court|tribunal/.test(
        m,
      )
    )
      return "MBOSS Lexon LLP represents clients before courts and tribunals across India. Our litigation team handles civil, commercial and corporate disputes with a focus on strategic, cost-effective resolution.";

    // Arbitration & Mediation
    if (
      /arbitrat|mediati|conciliat|adr|alternate dispute|icc|siac|lcia|settlement/.test(
        m,
      )
    )
      return "We offer expert arbitration and mediation services for commercial disputes — domestic and international. Our team is experienced with ICC, SIAC and ad-hoc arbitral proceedings.";

    // Real Estate & Property Law
    if (
      /real estate|property|land|title|conveyance|lease|rent|construct|registration deed|rera/.test(
        m,
      )
    )
      return "Our real estate practice covers property transactions, title due diligence, sale and lease deeds, construction agreements, land acquisition and RERA compliance. Reach out for a consultation.";

    // Labour & Employment Law
    if (
      /labour|employment|employee|hr|termination|retrench|posh|workplace|pf|esi|contract labour|staff/.test(
        m,
      )
    )
      return "We advise employers and employees on labour law compliance, employment contracts, termination procedures, POSH policy drafting and factory/contract-labour regulations. Contact us for HR legal support.";

    // Regulatory & Compliance
    if (
      /compliance|regulat|fssai|sebi|roc|mca|audit|annual filing|gst|company secretar/.test(
        m,
      )
    )
      return "MBOSS Lexon LLP provides end-to-end regulatory compliance support — ROC filings, MCA compliance, SEBI regulations, FSSAI, GST advisory and annual company secretarial work.";

    // Legal Process Outsourcing
    if (
      /lpo|legal process|outsourc|legal support|contract management|paralegal|document review/.test(
        m,
      )
    )
      return "Our LPO services offer cost-effective legal support to law firms and corporates — contract management, document review, legal research and paralegal support. Ask us about custom LPO packages.";

    // Industries — Education Consultants
    if (
      /education|school|college|university|study abroad|student visa|edtech|coaching/.test(
        m,
      )
    )
      return "We provide specialised legal services for education consultants and edtech companies — compliance, student agreements, franchise contracts and FEMA/visa-related advisory.";

    // Industries — Recruitment & Manpower
    if (
      /recruit|manpower|staffing|placement|hire|hrm|talent|agency|emigrat/.test(
        m,
      )
    )
      return "MBOSS Lexon LLP supports recruitment and manpower agencies with licensing, employment contracts, compliance and cross-border hiring documentation.";

    // Industries — Startups (industry page)
    if (/industry|sector|niche|specializ/.test(m))
      return "We serve multiple industry sectors including banking & finance, education consultants, recruitment & manpower agencies, and technology startups. Visit our Industries page to learn more.";

    // Online / remote consultation
    if (/online|remote|virtual|video call|digital|e-mail|email/.test(m))
      return "Yes, we offer fully remote consultations via video call and digital document delivery. Clients across India access our services without needing to visit our office.";

    // About / who we are
    if (/who are you|about mboss|about you|firm|llp|partners|founded/.test(m))
      return "MBOSS Lexon LLP is a full-service law firm registered in Kerala, India. We serve corporates, startups, banks, NBFCs, MSMEs and individuals across Kerala and pan-India with expert legal advisory.";

    // Team / lawyers
    if (
      /team|lawyer|advocate|attorney|partner|associate|who handles|expert/.test(
        m,
      )
    )
      return "Our team comprises experienced advocates and legal professionals specialising across all our practice areas. Visit the Team page on our website to learn about each member.";

    // Fees / pricing
    if (/fee|cost|charge|price|rate|billing|retainer|invoice/.test(m))
      return "Our fees depend on the scope and complexity of the matter. We offer a free initial consultation and will provide a transparent, tailored quote before any engagement begins.";

    // Location / office
    if (
      /location|office|address|kochi|trivandrum|thiruvananthapuram|kozhikode|thrissur|kerala|where/.test(
        m,
      )
    )
      return "MBOSS Lexon LLP is headquartered in Kerala and serves clients in Kochi, Trivandrum, Kozhikode, Thrissur and across India. Remote advisory is available for all clients.";

    // Contact / phone / WhatsApp
    if (/contact|phone|whatsapp|number|email|reach out|get in touch/.test(m))
      return "You can reach us at +91 8129497999 (also on WhatsApp) or via our Contact page. Our team responds within 48 hours.";

    // Thank you
    if (/thank|thanks|appreciate|great|helpful/.test(m))
      return "Thank you! It's our pleasure to help. Is there anything else I can assist you with?";

    // Default
    return "Thank you for reaching out to MBOSS Lexon LLP! We cover 12+ practice areas including corporate law, banking, startups, IP, contracts and more. Share more details about your query or visit our Contact page — our team will respond within 48 hours.";
  }
}

/* Schema injection helper – call from page if needed */
function injectSchema(obj) {
  const s = document.createElement("script");
  s.type = "application/ld+json";
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
  var section = document.getElementById("practice-areas");
  if (!section) return;

  var grid = section.querySelector(".grid");
  if (!grid) return;

  var srcCards = Array.from(grid.querySelectorAll(".practice-card"));
  var total = srcCards.length;

  var scrollBuf = null; // tall wrapper that provides scroll room
  var slider = null; // the slider DOM node appended into section
  var wraps = [];
  var currentIdx = 0;
  var isAnimating = false;

  /* ---- build ------------------------------------------------ */
  function build() {
    if (slider) return;

    // 1. Hide original grid
    grid.style.display = "none";

    // 2. Wrap section in a tall scroll-buffer div so the section
    //    can be position:sticky while the user scrolls through it.
    //    Buffer height = section height (100vh) + 55vh per extra card.
    scrollBuf = document.createElement("div");
    scrollBuf.className = "pm-scroll-buf";
    scrollBuf.style.height = 100 + (total - 1) * 55 + "vh";
    section.parentNode.insertBefore(scrollBuf, section);
    scrollBuf.appendChild(section);
    section.classList.add("pm-sticky");

    // 3. Build slider UI
    slider = document.createElement("div");
    slider.className = "pm-slider";

    // Key highlights injected into each mobile card (desktop cards untouched)
    var cardHighlights = [
      ["M&A Advisory", "Corporate Governance", "Shareholder Agreements"],
      ["SARFAESI Proceedings", "NPA Recovery", "Loan Documentation"],
      ["NDA & MoU Drafting", "Vendor Agreements", "Service Contracts"],
      ["DPIIT Recognition", "ESOP Structuring", "Fundraising Docs"],
      ["Regulatory Licensing", "Statutory Filings", "Compliance Advisory"],
      ["Trademark Registration", "Copyright Protection", "IP Licensing"],
      ["Civil Litigation", "Commercial Recovery", "Tribunal Representation"],
      ["Arbitration", "Mediation", "Conciliation"],
      ["Title Verification", "Sale Deeds", "Lease Documentation"],
      ["Employment Agreements", "HR Policy Drafting", "Dispute Management"],
      ["DPDP Act 2023", "Privacy Policies", "Data Processing Agreements"],
      ["Document Review", "Contract Management", "Compliance Monitoring"],
    ];

    var stage = document.createElement("div");
    stage.className = "pm-stage";

    wraps = srcCards.map(function (card, i) {
      var wrap = document.createElement("div");
      wrap.className = "pm-card-wrap" + (i === 0 ? " pm-static" : "");
      var clone = card.cloneNode(true);
      clone.classList.remove(
        "reveal",
        "reveal-delay-1",
        "reveal-delay-2",
        "reveal-delay-3",
      );
      clone.classList.add("visible");

      // Inject highlights list into the cloned card
      var hl = cardHighlights[i] || [];
      if (hl.length) {
        var divider = document.createElement("div");
        divider.className = "pm-card-divider";
        clone.insertBefore(divider, clone.querySelector(".card-link"));

        var ul = document.createElement("ul");
        ul.className = "pm-card-hl";
        hl.forEach(function (text) {
          var li = document.createElement("li");
          li.innerHTML =
            '<i class="fas fa-check-circle"></i><span>' + text + "</span>";
          ul.appendChild(li);
        });
        clone.insertBefore(ul, clone.querySelector(".card-link"));
      }

      wrap.appendChild(clone);
      stage.appendChild(wrap);
      return wrap;
    });

    // Counter: "1 / 12"
    var counter = document.createElement("div");
    counter.className = "pm-counter";
    counter.innerHTML =
      '<span class="pm-curr">1</span><span class="pm-sep"> / ' +
      total +
      "</span>";

    slider.appendChild(stage);
    slider.appendChild(counter);
    section.querySelector(".container").appendChild(slider);

    // Touch swipe (supplement to scroll)
    var touchY = 0;
    stage.addEventListener(
      "touchstart",
      function (e) {
        touchY = e.touches[0].clientY;
      },
      { passive: true },
    );
    stage.addEventListener(
      "touchend",
      function (e) {
        var dy = touchY - e.changedTouches[0].clientY;
        if (Math.abs(dy) > 44) goTo(dy > 0 ? currentIdx + 1 : currentIdx - 1);
      },
      { passive: true },
    );

    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- goTo ------------------------------------------------- */
  function goTo(idx) {
    if (isAnimating) return;
    idx = Math.max(0, Math.min(total - 1, idx));
    if (idx === currentIdx) return;

    isAnimating = true;
    var dir = idx > currentIdx ? 1 : -1;
    var curr = wraps[currentIdx];
    var next = wraps[idx];

    [curr, next].forEach(function (w) {
      w.classList.remove(
        "pm-static",
        "pm-exit-up",
        "pm-exit-down",
        "pm-enter-bottom",
        "pm-enter-top",
      );
    });

    curr.style.zIndex = "1";
    next.style.zIndex = "2";
    curr.classList.add(dir > 0 ? "pm-exit-up" : "pm-exit-down");
    next.classList.add(dir > 0 ? "pm-enter-bottom" : "pm-enter-top");

    // Update counter
    var el = slider.querySelector(".pm-curr");
    if (el) el.textContent = idx + 1;

    setTimeout(function () {
      curr.classList.remove("pm-exit-up", "pm-exit-down");
      curr.style.zIndex = "";
      next.classList.remove("pm-enter-bottom", "pm-enter-top");
      next.classList.add("pm-static");
      next.style.zIndex = "";
      currentIdx = idx;
      isAnimating = false;
    }, 460);
  }

  /* ---- onScroll --------------------------------------------- */
  // Map scroll progress through the buffer to a card index.
  function onScroll() {
    if (!scrollBuf) return;
    var bufH = scrollBuf.offsetHeight;
    var vh = window.innerHeight;
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
    window.removeEventListener("scroll", onScroll);

    // Restore DOM: move section back before the buffer, remove buffer
    if (scrollBuf && scrollBuf.parentNode) {
      scrollBuf.parentNode.insertBefore(section, scrollBuf);
      scrollBuf.remove();
    }
    scrollBuf = null;
    section.classList.remove("pm-sticky");

    slider.remove();
    slider = null;
    wraps = [];
    currentIdx = 0;
    isAnimating = false;
    grid.style.display = "";
  }

  /* ---- init ------------------------------------------------- */
  function check() {
    if (window.innerWidth <= 768) build();
    else teardown();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", check);
  } else {
    check();
  }

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(check, 200);
  });
})();
