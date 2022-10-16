// On and Off Switch
const CreateToggle = document.querySelector(".switch2.create-sens input");
// On and Off Text
const Createsens_wrapper = document.querySelector(".wrapper-body.create-sens");
const Createsens_inner = Createsens_wrapper.querySelector(
  ".wrapper-body-inner"
);
const CreateStatusText = Createsens_wrapper.querySelector(".body-text");
CreateStatusText.setAttribute("style", "opacity: 0.7;");
Createsens_inner.setAttribute("style", "opacity: 0.4;");
// get extention status from "chrome.storage"
chrome.storage.sync.get(["create_sens_status"], function (result) {
  if (
    !result ||
    (!result["create_sens_status"] === true &&
      !result["create_sens_status"] === false)
  ) {
    // if cyber-status is not found , init that
    swith3(true);
  } else if (result["create_sens_status"]) {
    swith3(result["create_sens_status"]);
  }
});

// listen to On and Off swith3
CreateToggle.addEventListener("change", function () {
  if (CreateToggle.checked === true) swith3(true);
  else swith3(false);
});

function swith3(status) {
  // turn on
  if (status === true) {
    CreateStatusText.setAttribute("style", "opacity: 1;");
    Createsens_inner.setAttribute("style", "opacity: 1;");
    chrome.storage.sync.set({ create_sens_status: true }, function () {
      CreateToggle.checked = true;
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
    CreateStatusText.setAttribute("style", "opacity: 0.7;");
    Createsens_inner.setAttribute("style", "opacity: 0.4;");
    chrome.storage.sync.set({ create_sens_status: false }, function () {
      CreateToggle.checked = false;
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
const create_sens_input = document.querySelector(
  ".create-sens input[type=number]"
);
chrome.storage.sync.get(["create_sens"], function (result) {
  if (result) create_sens_input.value = result["create_sens"];
});
create_sens_input.addEventListener("keyup", function () {
  chrome.storage.sync.set({ create_sens: parseInt(create_sens_input.value) });
});
