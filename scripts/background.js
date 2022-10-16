async function getruntime() {
  let cyber_status = true;
  let words = null;
  let following_sens = 0;
  let following_sens_status = false;
  let create_sens = 0;
  let create_sens_status = false;
  await chrome.storage.sync.get(["cyber-status"], function (result) {
    cyber_status = result["cyber-status"];
  });
  await chrome.storage.sync.get(["cyber-words"], function (result) {
    words = result["cyber-words"];
  });
  await chrome.storage.sync.get(["following_sens"], function (result) {
    following_sens = result["following_sens"];
  });
  await chrome.storage.sync.get(["following_sens_status"], function (result) {
    following_sens_status = result["following_sens_status"];
  });
  await chrome.storage.sync.get(["create_sens_status"], function (result) {
    create_sens_status = result["create_sens_status"];
  });
  await chrome.storage.sync.get(["create_sens"], function (result) {
    create_sens = result["create_sens"];
  });

  chrome.storage.onChanged.addListener(function () {
    chrome.storage.sync.get(["cyber-status"], function (result) {
      if (result["cyber-status"]) {
        cyber_status = result["cyber-status"];
      }
    });
    chrome.storage.sync.get(["cyber-words"], function (result) {
      if (result["cyber-words"]) {
        words = result["cyber-words"];
      }
    });
    chrome.storage.sync.get(["following_sens"], function (result) {
      if (result["following_sens"]) {
        following_sens = result["following_sens"];
      }
    });
    chrome.storage.sync.get(["following_sens_status"], function (result) {
      if (result["following_sens_status"]) {
        following_sens_status = result["following_sens_status"];
      }
    });
    chrome.storage.sync.get(["create_sens_status"], function (result) {
      if (result["create_sens_status"]) {
        create_sens_status = result["create_sens_status"];
      }
    });
    chrome.storage.sync.get(["create_sens"], function (result) {
      if (result["create_sens"]) {
        create_sens = result["create_sens"];
      }
    });
  });

  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.message === "get-data") {
      getruntime();
      sendResponse({
        words_status: cyber_status,
        words: words,
        following_sens: following_sens,
        following_sens_status: following_sens_status,
        create_sens: create_sens,
        create_sens_status: create_sens_status,
      });
    }
  });
}

getruntime();

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  getruntime();
  // read changeInfo data and do something with it (like read the url)
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, {
      message: "TabUpdated",
    });
    console.log("url updated");
  }
});
