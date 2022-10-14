function words_body_item(wrapper, text, words) {
  const item = document.createElement("div");
  const itemicon = document.createElement("span");
  itemicon.className = "material-icons";
  itemicon.innerHTML = "&#xe5cd;";
  item.className = "add-word-body-item";

  item.addEventListener("click", function () {
    item.remove();
    const temp = new Set(JSON.parse(words));
    temp.delete(text);
    window.localStorage.setItem(
      "cyber-words",
      JSON.stringify(Array.from(temp))
    );
  });
  item.innerText = text;
  item.appendChild(itemicon);
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
    let words = window.localStorage.getItem("cyber-words") || null;
    const import_word = document.querySelector(".import-word");
    const export_word = document.querySelector(".export-word");
    const notifclose = document.querySelector(".notif > .close");
    const notifclosewrapper = document.querySelector(".notif-wrapper");
    const addwordlistinput = document.querySelector(".addwordlist > input");
    const addwordlistwrapper_close =
      document.querySelector(".addwordlist-close");
    const addwordlistwrapper = document.querySelector(
      ".addwordlist-wrapper-close"
    );
    const words_body = document.querySelector(".add-word-body");
    if (words === null) {
      words_body.innerHTML = "موردی یافت نشد";
    }

    if (words && JSON.parse(words).length > 0) {
      words_body.innerHTML = "";
      const temp = new Set(JSON.parse(words));
      console.log(temp);
      temp.forEach((element) => {
        words_body_item(words_body, element, words);
      });
    }

    function additemtowords() {
      if (words && JSON.parse(words).length > 0 && addInput.value) {
        const temp = new Set(JSON.parse(words));
        temp.add(addInput.value);
        words_body_item(words_body, addInput.value);
        addInput.value = "";
        window.localStorage.setItem(
          "cyber-words",
          JSON.stringify(Array.from(temp))
        );
      }
    }

    addInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") additemtowords();
    });

    addButton.addEventListener("click", additemtowords);

    import_word.addEventListener("click", function () {
      document.querySelector(".addwordlist-wrapper").style.display = "flex";
    });

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
      // alert("Copied the text: " + copyText.value);
      document.querySelector(".notif-wrapper").style.display = "flex";
    });
    notifclose.addEventListener("click", function () {
      document.querySelector(".notif-wrapper").style.display = "none";
    });
    notifclosewrapper.addEventListener("click", function () {
      document.querySelector(".notif-wrapper").style.display = "none";
    });
    addwordlistwrapper.addEventListener("click", function () {
      document.querySelector(".addwordlist-wrapper").style.display = "none";
    });
    addwordlistwrapper_close.addEventListener("click", function () {
      document.querySelector(".addwordlist-wrapper").style.display = "none";
      const inputlistword = new Set(JSON.parse(addwordlistinput.value));
      const temp = new Set(JSON.parse(words));
      const finalwordlist = new Set([...inputlistword, ...temp]);
      console.log(finalwordlist);
      window.localStorage.setItem(
        "cyber-words",
        JSON.stringify(Array.from(finalwordlist))
      );
      words = window.localStorage.getItem("cyber-words");
      if (words && JSON.parse(words).length > 0) {
        words_body.innerHTML = "";
        const temp = new Set(JSON.parse(words));
        temp.forEach((element) => {
          words_body_item(words_body, element);
        });
      }
    });

    if (retry++ > 15 || words_body) clearInterval(intervalId);
  }, 1000);
});

const CyberToggle = document.querySelector(".switch2 input");
const CyberText = document.querySelector(".body-text");
chrome.storage.sync.get(["cyber-status"], function (result) {
  console.log(result["cyber-status"]);
  if (!result || !result["cyber-status"]) {
    turnOn();
  } else {
    if (result["cyber-status"] === "true") turnOn();
    if (result["cyber-status"] === "false") turnOff();
  }
});

CyberToggle.addEventListener("change", function () {
  if (CyberToggle.checked === true) turnOn();
  else turnOff();
});

// function changeinContent(e) {
//   // Query tab
//   let queryOptions = { active: true, currentWindow: true };
//   let tabs = chrome.tabs.query(queryOptions);

//   // Open up connection
//   const port = chrome.tabs.connect(tabs[0].id, {
//     name: "uiOps",
//   });

//   // Get input value
//   port.postMessage({
//     id: "ff",
//   });

//   port.onMessage.addListener(function (msg) {
//     console.msg;
//   });
// }

function turnOn() {
  // window.localStorage.setItem("cyber-status", "true");
  CyberText.textContent = "سایبریاب روشن است";
  chrome.storage.sync.set({ "cyber-status": "true" }, function () {
    CyberToggle.checked = true;
  });
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { status: true }, function (response) {
      console.log(response);
    });
  });
}
function turnOff() {
  // window.localStorage.setItem("cyber-status", "false");
  CyberText.textContent = "سایبریاب خاموش است";
  chrome.storage.sync.set({ "cyber-status": "false" }, function () {
    CyberToggle.checked = false;
  });
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { status: false }, function (response) {
      console.log(response);
    });
  });
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
