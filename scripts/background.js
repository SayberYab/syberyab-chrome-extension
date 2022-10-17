let cyber_status = true;
let words = null;
let following_sens = 0;
let following_sens_status = false;
let create_sens = 0;
let create_sens_status = false;
async function getruntime() {
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
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
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

chrome.storage.onChanged.addListener(async function () {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  await getruntime();
  chrome.tabs.sendMessage(tab.id, {
    message: "dataUpdated",
  });
});

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  await getruntime();
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, {
      message: "TabUpdated",
    });
  }
});

chrome.runtime.onInstalled.addListener(function (details) {
  let updateurl = "https://sayberyab.com/help";
  let installurl = "https://sayberyab.com/help";
  if (details.reason == "install") {
    chrome.tabs.create({ url: installurl });
  } else if (details.reason == "update") {
    chrome.tabs.create({ url: updateurl });
  }
});
