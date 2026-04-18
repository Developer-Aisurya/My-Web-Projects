let canvas = document.querySelector(".color-canvas");
let generateBtn = document.querySelector(".random-color-btn");
let copyBtn = document.querySelector(".copy-btn");
let colorName = document.querySelector(".color-name");
let hexCode = document.querySelector(".hex-code");

// Small set of CSS named colors (exact match only)
const cssColors = {
  "#FF0000": "Red",
  "#00FF00": "Lime",
  "#0000FF": "Blue",
  "#FFFF00": "Yellow",
  "#00FFFF": "Cyan",
  "#FF00FF": "Magenta",
  "#000000": "Black",
  "#FFFFFF": "White",
  "#808080": "Gray",
  "#800000": "Maroon",
  "#808000": "Olive",
  "#008000": "Green",
  "#800080": "Purple",
  "#008080": "Teal",
  "#000080": "Navy",
  "#FFA500": "Orange",
  "#FFC0CB": "Pink",
  "#A52A2A": "Brown",
  "#F5F5DC": "Beige",
  "#ADD8E6": "LightBlue"
};


function getRandomHex() {
  let chars = "0123456789ABCDEF";
  let hex = "#";

  for (let i = 0; i < 6; i++) {
    hex += chars[Math.floor(Math.random() * 16)];
  }

  return hex;
}

generateBtn.addEventListener("click", () => {
  let hex = getRandomHex();

  canvas.style.backgroundColor = hex;
  hexCode.innerText = hex;

  if (cssColors[hex]) {
    colorName.innerText = cssColors[hex];
  } else {
    colorName.innerText = "No exact CSS name 😅";
  }
});

copyBtn.addEventListener("click", () => {
  let text = hexCode.innerText;

  navigator.clipboard.writeText(text).then(() => {
    copyBtn.innerText = "Copied ✅";

    setTimeout(() => {
      copyBtn.innerText = "Copy";
    }, 1500);
  });
});
