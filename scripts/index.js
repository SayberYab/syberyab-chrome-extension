// function loadHTML() {
//   fetch("home.html")
//     .then((response) => response.text())
//     .then((text) => (document.querySelector(".wrapper").innerHTML = text));
// }

// loadHTML();

const addWord = document.querySelector(".add-word");
addWord.addEventListener("click", function () {
  fetch("./pages/addword.html")
    .then((response) => response.text())
    .then((text) => (document.querySelector(".wrapper").innerHTML = text));
});

const CyberToggle = document.querySelector(".switch2 input");
const CyberText = document.querySelector(".body-text");
const Cyberstatus = window.localStorage.getItem("cyber-status") || null;
if (!Cyberstatus || Cyberstatus === null) {
  window.localStorage.setItem("cyber-status", "true");
  turnOn();
}
if (Cyberstatus && Cyberstatus === "true") turnOn();
if (Cyberstatus && Cyberstatus === "false") turnOff();

CyberToggle.addEventListener("change", function () {
  if (CyberToggle.checked === true) turnOn();
  else turnOff();
});

function turnOn() {
  window.localStorage.setItem("cyber-status", "true");
  CyberText.textContent = "سایبریاب روشن است";
  CyberToggle.checked = true;
}
function turnOff() {
  window.localStorage.setItem("cyber-status", "false");
  CyberText.textContent = "سایبریاب خاموش است";
  CyberToggle.checked = false;
}

const ThemeToggle = document.querySelector(".switch input");
const ThemeText = document.querySelector(".dark-mode-text");
const Themestatus = window.localStorage.getItem("theme") || null;
if (!Themestatus || Themestatus === null) {
  window.localStorage.setItem("theme", "dark");
  light();
}
if (Themestatus && Themestatus === "light") light();
if (Themestatus && Themestatus === "dark") dark();

ThemeToggle.addEventListener("change", function () {
  if (ThemeToggle.checked === false) light();
  if (ThemeToggle.checked === true) dark();
});

function light() {
  window.localStorage.setItem("theme", "light");
  ThemeText.innerHTML = "حالت روز";
  ThemeToggle.checked = false;
  document.querySelector(":root").classList.remove("dark");
}
function dark() {
  window.localStorage.setItem("theme", "dark");
  ThemeText.innerHTML = "حالت شب";
  ThemeToggle.checked = true;
  document.querySelector(":root").classList.add("dark");
}
