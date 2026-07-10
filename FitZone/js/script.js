/*====================================
  FITZONE - PART 1
  Sticky Header + Hero Text + Counter
====================================*/

//========== STICKY HEADER ==========//

const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.style.background = "rgba(0,0,0,.88)";
    header.style.backdropFilter = "blur(12px)";
    header.style.boxShadow = "0 6px 20px rgba(0,0,0,.25)";
  } else {
    header.style.background = "rgba(0,0,0,.3)";
    header.style.backdropFilter = "blur(12px)";
    header.style.boxShadow = "none";
  }
});

//========== HERO TEXT ROTATION ==========//

const words = document.querySelectorAll(".txt-rotate .word");

let currentWordIndex = 0;

if (words.length > 1) {
  words[0].classList.add("active");

  setInterval(() => {
    const current = words[currentWordIndex];

    const nextIndex = (currentWordIndex + 1) % words.length;

    const next = words[nextIndex];

    current.classList.remove("active");
    current.classList.add("exit");

    next.classList.add("active");

    setTimeout(() => {
      current.classList.remove("exit");
    }, 500);

    currentWordIndex = nextIndex;
  }, 2200);
}

//========== STATS COUNTER ==========//

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;

      const target = Number(counter.dataset.target);

      let current = 0;

      const increment = Math.ceil(target / 100);

      function updateCounter() {
        current += increment;

        if (current < target) {
          counter.textContent = current + "+";

          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + "+";
        }
      }

      updateCounter();

      observer.unobserve(counter);
    });
  },
  {
    threshold: 0.5,
  },
);

counters.forEach((counter) => {
  counterObserver.observe(counter);
});

//========== SMOOTH SCROLL ==========//

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));

    if (!target) return;

    e.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

/*====================================
  FITZONE - PART 2
  FAQ + Mobile Navigation
====================================*/

//========== FAQ ACCORDION ==========//

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");

  question.addEventListener("click", () => {
    const isActive = item.classList.contains("active");

    faqItems.forEach((faq) => {
      faq.classList.remove("active");
    });

    if (!isActive) {
      item.classList.add("active");
    }
  });
});

//========== MOBILE MENU ==========//

const menuBtn = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-links");

if (menuBtn && navMenu) {
  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    navMenu.classList.toggle("show");
  });
}

//========== CLOSE MOBILE MENU ==========//

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    if (menuBtn && navMenu) {
      menuBtn.classList.remove("active");
      navMenu.classList.remove("show");
    }
  });
});

/*====================================
  FITZONE - PART 3
  Scroll Reveal + Back To Top
====================================*/

//========== SCROLL REVEAL ==========//

const revealItems = document.querySelectorAll(`
.hero-content,
.stat-card,
.about-text,
.about-image,
.feature-card,
.class-card,
.result-card,
.result-middle,
.trainers-content,
.trainers-image,
.price-card,
.faq-item,
.cta-content,
.cta-image,
.footer-col
`);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  },
);

revealItems.forEach((item) => {
  revealObserver.observe(item);
});

//========== BACK TO TOP ==========//

const backTop = document.querySelector(".back-top");

if (backTop) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      backTop.classList.add("show");
    } else {
      backTop.classList.remove("show");
    }
  });

  backTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

//========== PREVENT IMAGE DRAG ==========//

document.querySelectorAll("img").forEach((img) => {
  img.draggable = false;
});

//========== PAGE LOADED ==========//

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
