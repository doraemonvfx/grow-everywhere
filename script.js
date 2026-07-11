const body = document.body;
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const reveals = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-counter]");
const faqItems = document.querySelectorAll(".faq-item");
const backToTop = document.querySelector(".back-to-top");
const progressBar = document.querySelector(".scroll-progress");
const cursorGlow = document.querySelector(".cursor-glow");
const typedText = document.querySelector(".typed-text");
const loader = document.querySelector(".page-loader");
const popup = document.querySelector(".lead-popup");
const popupClose = document.querySelector(".popup-close");
const popupDismiss = document.querySelector(".popup-dismiss");
const calendlyButtons = document.querySelectorAll("[data-calendly-popup]");
const tiltCards = document.querySelectorAll(".tilt-card");
const prefersFinePointer = window.matchMedia("(pointer:fine)");

const typingWords = ["Marketplace.", "Marketing.", "Growth."];
let typingWordIndex = 0;
let typingCharIndex = 0;
let typingDeleting = false;

function setHeaderState() {
  const scrolled = window.scrollY > 24;
  header.classList.toggle("scrolled", scrolled);
  backToTop.classList.toggle("visible", window.scrollY > 500);
}

function toggleMenu() {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
  header.classList.toggle("menu-open");
  body.classList.toggle("menu-open");
}

function closeMenu() {
  navToggle.setAttribute("aria-expanded", "false");
  header.classList.remove("menu-open");
  body.classList.remove("menu-open");
}

function updateScrollProgress() {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

function animateCounter(counter) {
  const target = Number(counter.dataset.counter);
  const duration = 1400;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    counter.textContent = Math.floor(progress * target).toLocaleString("en-IN");
    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      counter.textContent = target.toLocaleString("en-IN");
    }
  }

  requestAnimationFrame(frame);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      if (entry.target.querySelector("[data-counter]")) {
        entry.target.querySelectorAll("[data-counter]").forEach((counter) => {
          if (!counter.dataset.animated) {
            counter.dataset.animated = "true";
            animateCounter(counter);
          }
        });
      }
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

reveals.forEach((item) => revealObserver.observe(item));

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  button.addEventListener("click", () => {
    const isActive = item.classList.contains("active");

    faqItems.forEach((faqItem) => {
      faqItem.classList.remove("active");
      faqItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      faqItem.querySelector(".faq-answer").style.maxHeight = null;
    });

    if (!isActive) {
      item.classList.add("active");
      button.setAttribute("aria-expanded", "true");
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });
});

function typeLoop() {
  if (!typedText) {
    return;
  }

  const currentWord = typingWords[typingWordIndex];

  if (!typingDeleting) {
    typingCharIndex += 1;
    typedText.textContent = currentWord.slice(0, typingCharIndex);
    if (typingCharIndex === currentWord.length) {
      typingDeleting = true;
      setTimeout(typeLoop, 1300);
      return;
    }
  } else {
    typingCharIndex -= 1;
    typedText.textContent = currentWord.slice(0, typingCharIndex);
    if (typingCharIndex === 0) {
      typingDeleting = false;
      typingWordIndex = (typingWordIndex + 1) % typingWords.length;
    }
  }

  setTimeout(typeLoop, typingDeleting ? 65 : 100);
}

function openCalendlyPopup() {
  if (window.Calendly) {
    window.Calendly.initPopupWidget({
      url: "https://calendly.com/shivamspal98/30min"
    });
  }
}

function initCalendlyBadge() {
  if (window.Calendly && !window.__calendlyBadgeInit) {
    window.Calendly.initBadgeWidget({
      url: "https://calendly.com/shivamspal98/30min",
      text: "Schedule time with me",
      color: "#f87858",
      textColor: "#ffffff",
      branding: true
    });
    window.__calendlyBadgeInit = true;
  }
}

function ensureCalendlyBadge() {
  if (window.Calendly) {
    initCalendlyBadge();
    return;
  }

  window.setTimeout(ensureCalendlyBadge, 250);
}

function showPopup() {
  if (localStorage.getItem("leadPopupDismissed") === "true") {
    return;
  }

  popup.classList.add("active");
  popup.setAttribute("aria-hidden", "false");
  body.classList.add("popup-open");
}

function hidePopup(remember = false) {
  popup.classList.remove("active");
  popup.setAttribute("aria-hidden", "true");
  body.classList.remove("popup-open");
  if (remember) {
    localStorage.setItem("leadPopupDismissed", "true");
  }
}

let exitIntentTriggered = false;
function handleExitIntent(event) {
  if (event.clientY <= 0 && !exitIntentTriggered) {
    exitIntentTriggered = true;
    showPopup();
  }
}

function updateCursorGlow(event) {
  if (!prefersFinePointer.matches) {
    return;
  }

  cursorGlow.style.opacity = "1";
  cursorGlow.style.transform = `translate(${event.clientX - 90}px, ${event.clientY - 90}px)`;
}

function handleTilt(event) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -10;
  const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
}

function resetTilt(event) {
  event.currentTarget.style.transform = "";
}

navToggle?.addEventListener("click", toggleMenu);

navMenu?.querySelectorAll("a, button").forEach((item) => {
  item.addEventListener("click", closeMenu);
});

calendlyButtons.forEach((button) => {
  button.addEventListener("click", openCalendlyPopup);
});

popupClose?.addEventListener("click", () => hidePopup(true));
popupDismiss?.addEventListener("click", () => hidePopup(true));
popup?.addEventListener("click", (event) => {
  if (event.target === popup) {
    hidePopup(true);
  }
});

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", handleTilt);
  card.addEventListener("mouseleave", resetTilt);
});

window.addEventListener("scroll", () => {
  setHeaderState();
  updateScrollProgress();
});

window.addEventListener("mousemove", updateCursorGlow);
window.addEventListener("mouseout", () => {
  cursorGlow.style.opacity = "0";
});
document.addEventListener("mouseleave", handleExitIntent);

window.addEventListener("load", () => {
  setHeaderState();
  updateScrollProgress();
  ensureCalendlyBadge();
  typeLoop();
  setTimeout(() => {
    loader.classList.add("hidden");
  }, 450);
});

document.querySelector(".contact-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const submitButton = event.currentTarget.querySelector("button[type='submit']");
  const originalLabel = submitButton.textContent;
  const endpoint = form.dataset.sheetEndpoint;

  if (!endpoint || endpoint === "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE") {
    submitButton.textContent = "Add Script URL";
    submitButton.disabled = true;
    setTimeout(() => {
      submitButton.textContent = originalLabel;
      submitButton.disabled = false;
    }, 1800);
    return;
  }

  const formData = new FormData(form);
  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    business: formData.get("business"),
    service: formData.get("service"),
    message: formData.get("message")
  };

  submitButton.textContent = "Sending...";
  submitButton.disabled = true;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    submitButton.textContent = "Inquiry Sent";
    form.reset();
  } catch (error) {
    submitButton.textContent = "Try Again";
  }

  setTimeout(() => {
    submitButton.textContent = originalLabel;
    submitButton.disabled = false;
  }, 1800);
});
