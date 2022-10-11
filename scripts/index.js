// function loadHTML() {
//   fetch("home.html")
//     .then((response) => response.text())
//     .then((text) => (document.querySelector(".wrapper").innerHTML = text));
// }

// loadHTML();

function loadFileAsText() {
  var myFile = document.getElementById("myFile").files[0];

  var fileReader = new FileReader();
  fileReader.onload = function (fileLoadedEvent) {
    var textFromFileLoaded = fileLoadedEvent.target.result;
    document.getElementById("inputTextToSave").value = textFromFileLoaded;
    console.log(textFromFileLoaded);
  };

  fileReader.readAsText(myFile, "UTF-8");
}
function savefile() {
  var content = document.getElementById("inputTextToSave").value;
  uriContent = "data:application/octet-stream," + encodeURIComponent(content);
  document.getElementById("dlink").innerHTML =
    "<a href=" +
    uriContent +
    ' download="savedfile.txt">Here is the download link</a>';
}

function words_body_item(wrapper, text) {
  const item = document.createElement("div");
  item.className = "add-word-body-item";
  item.innerText = text;
  wrapper.appendChild(item);
}

const addWord = document.querySelector(".add-word");
addWord.addEventListener("click", function () {
  fetch("./pages/addword.html")
    .then((response) => response.text())
    .then(
      (text) => (document.querySelector(".change-wrapper").innerHTML = text)
    );
  var retry = 0;
  var intervalId = setInterval(function () {
    const addButton = document.querySelector(".add-word-header > button");
    const addInput = document.querySelector(".add-word-header > input");
    const words = window.localStorage.getItem("cyber-words") || null;
    const import_word = document.querySelector(".import-word");
    const export_word = document.querySelector(".export-word");
    console.log(words);
    const words_body = document.querySelector(".add-word-body");
    if (words === null) {
      words_body.innerHTML = "موردی یافت نشد";
    }

    if (words && JSON.parse(words).length > 0) {
      words_body.innerHTML = "";
      const temp = JSON.parse(words);
      for (let i = 0; i < temp.length; i++) {
        words_body_item(words_body, temp[i]);
      }
    }

    function additemtowords() {
      if (words && JSON.parse(words).length > 0 && addInput.value) {
        const temp = JSON.parse(words);
        temp.push(addInput.value);
        words_body_item(words_body, addInput.value);
        addInput.value = "";
        window.localStorage.setItem("cyber-words", JSON.stringify(temp));
      }
    }

    addInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") additemtowords();
    });

    addButton.addEventListener("click", additemtowords);

    export_word.addEventListener("click", function () {
      // Get the text field
      let copyText = document.getElementById("myInput");
      copyText.value = words;

      // Select the text field
      copyText.select();
      copyText.setSelectionRange(0, 99999); // For mobile devices

      // Copy the text inside the text field
      navigator.clipboard.writeText(copyText.value);

      // Alert the copied text
      alert("Copied the text: " + copyText.value);
    });

    if (retry++ > 15 || words_body) clearInterval(intervalId);
  }, 1000);
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
