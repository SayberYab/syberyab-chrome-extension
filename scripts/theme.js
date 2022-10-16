const ThemeToggle = document.querySelector(".switch input");
const ThemeText = document.querySelector(".dark-mode-text");
const Themestatus = window.localStorage.getItem("theme") || null;
if (!Themestatus || Themestatus === null) {
  window.localStorage.setItem("theme", "dark");
  dark();
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
