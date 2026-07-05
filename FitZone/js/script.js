const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.style.background = "rgba(0,0,0,.85)";
  } else {
    header.style.background = "rgba(0,0,0,.3)";
  }
});

const words = document.querySelectorAll(".txt-rotate .word");
let currentWordIndex = 0;

function rotateText() {
  const currentWord = words[currentWordIndex];
  const nextWordIndex = (currentWordIndex + 1) % words.length;
  const nextWord = words[nextWordIndex];

  currentWord.classList.remove("active");
  currentWord.classList.add("exit");

  nextWord.classList.add("active");

  setTimeout(() => {
    currentWord.classList.remove("exit");
  }, 500);

  currentWordIndex = nextWordIndex;
}
if (words.length > 1) {
  setInterval(rotateText, 2000);
}

const counters = document.querySelectorAll(".counter");
const countingSpeed = 40; 

const startCounter = (counter) => {
  const target = +counter.getAttribute("data-target");
  let currentNum = 0;
  const step = target / countingSpeed;

  const runAnimation = () => {
    currentNum += step;
    if (currentNum < target) {
      counter.innerText = Math.floor(currentNum);
      setTimeout(runAnimation, 20);
    } else {
      counter.innerText = target + "+";
    }
  };
  runAnimation();
};

const observerOptions = { threshold: 0.2 };
const statsObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      startCounter(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

counters.forEach(counter => statsObserver.observe(counter));
