// On and Off Switch
const CyberToggle = document.querySelector(".switch2.words input");
// On and Off Text
const wordssens_wrapper = document.querySelector(".wrapper-body.words-sens");
const wordssens_inner = wordssens_wrapper.querySelector(".wrapper-body-inner");
const wordsStatusText = wordssens_wrapper.querySelector(".body-text");
wordsStatusText.setAttribute("style", "opacity: 0.7;");
wordssens_inner.setAttribute("style", "opacity: 0.4;");
// get extention status from "chrome.storage"
chrome.storage.sync.get(["cyber-status"], function (result) {
  if (
    !result ||
    (!result["cyber-status"] === true && !result["cyber-status"] === false)
  ) {
    // if cyber-status is not found , init that
    swith2(true);
  } else if (result["cyber-status"]) {
    swith2(result["cyber-status"]);
  }
});

// listen to On and Off swith2
CyberToggle.addEventListener("change", function () {
  if (CyberToggle.checked === true) swith2(true);
  else swith2(false);
});

function swith2(status) {
  // turn on
  if (status === true) {
    wordsStatusText.setAttribute("style", "opacity: 1;");
    wordssens_inner.setAttribute("style", "opacity: 1;");
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
    wordsStatusText.setAttribute("style", "opacity: 0.7;");
    wordssens_inner.setAttribute("style", "opacity: 0.4;");
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
