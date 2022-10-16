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
followingsens_inner.setAttribute("style", "opacity: 0.4;");
// get extention status from "chrome.storage"
chrome.storage.sync.get(["following_sens_status"], function (result) {
  if (
    !result ||
    (!result["following_sens_status"] === true &&
      !result["following_sens_status"] === false)
  ) {
    // if cyber-status is not found , init that
    swith(true);
  } else if (result["following_sens_status"]) {
    swith(result["following_sens_status"]);
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
    chrome.storage.sync.set({ following_sens_status: true }, function () {
      followingStatus.checked = true;
    });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { following_sens: true },
        function (response) {}
      );
    });
  }
  // turn off
  if (status === false) {
    followingStatusText.setAttribute("style", "opacity: 0.7;");
    followingsens_inner.setAttribute("style", "opacity: 0.4;");
    chrome.storage.sync.set({ following_sens_status: false }, function () {
      followingStatus.checked = false;
    });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { following_sens: false },
        function (response) {}
      );
    });
  }
}

// save following sens to storage
const following_sens_input = document.querySelector(
  ".following-sens input[type=number]"
);
chrome.storage.sync.get(["following_sens"], function (result) {
  if (result) following_sens_input.value = result["following_sens"];
});
following_sens_input.addEventListener("keyup", function () {
  chrome.storage.sync.set({
    following_sens: parseInt(following_sens_input.value),
  });
});
