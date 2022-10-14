// setTimeout(() => {
//   //   changeinContent();
//   chrome.runtime.sendMessage({
//     msg: "something_completed",
//     data: {
//       subject: "Loading",
//       content: "Just completed!",
//     },
//   });

//   chrome.runtime.onMessage.addListener(function (msg) {
//     console.log("message recieved" + msg);
//   });
// }, 5000);

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   console.log("message recived", request);
// });

// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//   chrome.tabs.sendMessage(
//     tabs[0].id,
//     { greeting: "hello" },
//     function (response) {
//       console.log(response);
//     }
//   );
// });
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
