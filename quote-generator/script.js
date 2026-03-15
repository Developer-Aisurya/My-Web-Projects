const quotes = [
  "The only way to do great work is to love what you do.",
  "Innovation distinguishes between a leader and a follower.",
  "Stay hungry, stay foolish.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "It does not matter how slowly you go as long as you do not stop.",
];

const authors = [
  "Steve Jobs",
  "Steve Jobs",
  "Steve Jobs",
  "Eleanor Roosevelt",
  "Confucius",
];

const colors = [
  "#ff758f", "#48cae4", "#ecf39e", "#cbc5ea",
  "#38b000", "#d4d700", "#4cc9f0", "#ffcc00",
];

const btn = document.getElementById("btn");
const quote = document.getElementById("quote");
const quoteBox = document.getElementById("quoteBox");

btn.addEventListener("click", () => {
  // Get random index for quote/author and color
  const index = Math.floor(Math.random() * quotes.length);
  const randColor = Math.floor(Math.random() * colors.length);

  // Update Quote
  quote.textContent = `"${quotes[index]}"`;

  // Handle Author Tag
  let authorName = document.getElementById("author-display");
  if (!authorName) {
    authorName = document.createElement("p");
    authorName.id = "author-display";
    authorName.style.marginTop = "15px";
    authorName.style.fontWeight = "bold";
    quoteBox.appendChild(authorName);
  }
  
  authorName.textContent = `— ${authors[index]}`;
  
  // Update Background
  quoteBox.style.backgroundColor = colors[randColor];
});
