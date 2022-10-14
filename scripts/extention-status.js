// On and Off Switch
const CyberToggle = document.querySelector(".switch2 input");
// On and Off Text
const CyberText = document.querySelector(".body-text");
// get extention status from "chrome.storage"
chrome.storage.sync.get(["cyber-status"], function (result) {
  if (!result || !result["cyber-status"]) {
    // if cyber-status is not found , init that
    swith(false);
  } else if (result["cyber-status"]) {
    swith(result["cyber-status"]);
  }
});

// listen to On and Off swith
CyberToggle.addEventListener("change", function () {
  if (CyberToggle.checked === true) swith(true);
  else swith(false);
});

function swith(status) {
  // turn on
  if (status === true) {
    CyberText.textContent = "سایبریاب روشن است";
    chrome.storage.sync.set({ "cyber-status": true }, function () {
      CyberToggle.checked = true;
    });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { status: true },
        function (response) {
          console.log(response);
        }
      );
    });
  }
  // turn off
  if (status === false) {
    CyberText.textContent = "سایبریاب خاموش است";
    chrome.storage.sync.set({ "cyber-status": false }, function () {
      CyberToggle.checked = false;
    });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { status: false },
        function (response) {
          console.log(response);
        }
      );
    });
  }
}
