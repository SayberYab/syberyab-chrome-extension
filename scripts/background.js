chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    files: ["content.js"],
  });
});

var cyber_status = "true";
chrome.storage.sync.get(["cyber-status"], function (result) {
  if (result["cyber-status"]) cyber_status = result["cyber-status"];
});

chrome.storage.onChanged.addListener(function () {
  chrome.storage.sync.get(["cyber-status"], function (result) {
    if (result["cyber-status"]) {
      cyber_status = result["cyber-status"];
      console.log("updated to ", cyber_status);
    }
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "get-status") {
    sendResponse({ status: cyber_status || "true" });
  }
  //   if (request.message === "get-words") {
  //     sendResponse({ words:  || [] });
  //   }
});
