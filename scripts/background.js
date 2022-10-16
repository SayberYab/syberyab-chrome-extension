async function getruntime() {
  let cyber_status = "true";
  let words;
  let following_sens;
  await chrome.storage.sync.get(["cyber-status"], function (result) {
    if (result["cyber-status"]) cyber_status = result["cyber-status"];
  });
  await chrome.storage.sync.get(["cyber-words"], function (result) {
    if (result["cyber-words"]) words = result["cyber-words"];
  });
  await chrome.storage.sync.get(["following_sens"], function (result) {
    if (result["following_sens"]) following_sens = result["following_sens"];
  });

  console.log(words);
  chrome.storage.onChanged.addListener(function () {
    chrome.storage.sync.get(["cyber-status"], function (result) {
      if (result["cyber-status"]) {
        cyber_status = result["cyber-status"];
        console.log("updated to ", cyber_status);
      }
    });
    chrome.storage.sync.get(["cyber-words"], function (result) {
      if (result["cyber-words"]) {
        words = result["cyber-words"];
        console.log("updated to ", words);
      }
    });
    chrome.storage.sync.get(["following_sens"], function (result) {
      if (result["following_sens"]) {
        words = result["following_sens"];
        console.log("updated to ", following_sens);
      }
    });
  });

  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    console.log("message");
    if (request.message === "get-status") {
      sendResponse({ status: cyber_status || "true" });
    }
    if (request.message === "get-words") {
      sendResponse({ words: words || [] });
    }
    if (request.message === "get-following-sens") {
      sendResponse({ following_sens: following_sens || [] });
    }
  });
}

getruntime();

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // read changeInfo data and do something with it (like read the url)
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, {
      message: "TabUpdated",
    });
    console.log("url updated");
  }
});
