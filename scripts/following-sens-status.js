// On and Off Switch
const followingStatus = document.querySelector(".switch2.sens input");
// On and Off Text
const followingsens_wrapper = document.querySelector(
  ".wrapper-body.following-sens"
);
const followingsens_inner = followingsens_wrapper.querySelector(
  ".wrapper-body-inner"
);
const followingStatusText = followingsens_wrapper.querySelector(".body-text");
followingStatusText.setAttribute("style", "opacity: 0.7;");
followingsens_inner.setAttribute("style", "opacity: 0.2;");
// get extention status from "chrome.storage"
chrome.storage.sync.get(["following_sens"], function (result) {
  if (
    !result ||
    (!result["following_sens"] === true && !result["following_sens"] === false)
  ) {
    // if cyber-status is not found , init that
    swith(true);
    console.log("init");
  } else if (result["following_sens"]) {
    console.log("not init", result["following_sens"]);

    swith(result["following_sens"]);
  }
});

// listen to On and Off swith
followingStatus.addEventListener("change", function () {
  if (followingStatus.checked === true) swith(true);
  else swith(false);
});

function swith(status) {
  // turn on
  if (status === true) {
    followingStatusText.setAttribute("style", "opacity: 1;");
    followingsens_inner.setAttribute("style", "opacity: 1;");
    chrome.storage.sync.set({ following_sens: true }, function () {
      followingStatus.checked = true;
    });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { following_sens: true },
        function (response) {
          console.log(response);
        }
      );
    });
  }
  // turn off
  if (status === false) {
    followingStatusText.setAttribute("style", "opacity: 0.7;");
    followingsens_inner.setAttribute("style", "opacity: 0.2;");
    chrome.storage.sync.set({ following_sens: false }, function () {
      followingStatus.checked = false;
    });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { following_sens: false },
        function (response) {
          console.log(response);
        }
      );
    });
  }
}
