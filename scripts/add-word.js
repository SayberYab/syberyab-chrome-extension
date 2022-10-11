console.log("ddd");
const words = window.localStorage.getItem("cyber-words") || null;
const words_body = document.querySelector(".add-word-body");
if (words === null) {
  words_body.innerHTML = "موردی یافت نشد";
}
