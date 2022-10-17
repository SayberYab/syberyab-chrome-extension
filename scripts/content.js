let cyberPercent = 0;
let words_array = null;
let words_status = false;
let sens_input = 0;
let sens_status = false;
let create_sens_input = 0;
let create_sens_status = false;

async function check_joined_date() {
  // check joined date
  let joinedDate = document.querySelector("[data-testid=UserJoinDate]");
  joinedDate = joinedDate.innerText.replace(/^\D+/g, "");
  joinedDate = joinedDate && parseInt(joinedDate);
  if (joinedDate && create_sens_input && joinedDate > create_sens_input) {
    cyberPercent += joinedDate - create_sens_input;
  }
}

async function check_name() {
  // check name
  let name = document.querySelector("title");
  if (name && words_array && words_array.length) {
    for (let i = 0; i < words_array.length; i++) {
      if (
        name.innerText
          .toLocaleLowerCase()
          .includes(words_array[i].toLocaleLowerCase())
      ) {
        cyberPercent += 30;
      }
    }
  }
}

async function check_username() {
  const url = window.location.href;
  const username = url.split("/")[3];
  //check username
  if (username && words_array && words_array.length) {
    for (let i = 0; i < words_array.length; i++) {
      if (
        username
          .toLocaleLowerCase()
          .includes(words_array[i].toLocaleLowerCase())
      ) {
        cyberPercent += 30;
      }
    }
  }
}

async function check_description() {
  //check description
  let description = document.querySelector("[data-testid=UserDescription]");
  if (
    description &&
    words_array &&
    words_array.length &&
    words_array.length > 0
  ) {
    for (let i = 0; i < words_array.length; i++) {
      if (
        description.innerText
          .toLocaleLowerCase()
          .includes(words_array[i].toLocaleLowerCase())
      ) {
        cyberPercent += 10;
      }
    }
  }
}

async function check_followerـdifference() {
  const url = window.location.href;
  const username = url.split("/")[3];
  const sens_followers = document.querySelector(
    `a[href$="${username}/followers"]`
  );
  const sens_followings = document.querySelector(
    `a[href$="${username}/following"]`
  );
  let sens_final = 0;
  if (sens_followers.innerText && sens_followings.innerText) {
    sens_final =
      parseInt(sens_followers.innerText) - parseInt(sens_followings.innerText);
    sens_final =
      sens_final && parseInt(sens_final.toString().replace(/\D/g, ""));
    if (sens_final <= sens_input) {
      sens_final = sens_input - sens_final;
      cyberPercent += 20;
    }
  }
}

async function check_location() {
  //check location
  let location = document.querySelector("[data-testid=UserLocation]");
  if (location && words_array && words_array.length) {
    for (let i = 0; i < words_array.length; i++) {
      if (
        location.innerText
          .toLocaleLowerCase()
          .includes(words_array[i].toLocaleLowerCase())
      ) {
        cyberPercent += 10;
      }
    }
  }
}

async function GetDataFromBackground() {
  await chrome.runtime.sendMessage(
    { message: "get-data" },
    function (response) {
      if (response.words_status) words_status = response.words_status;
      if (response.words) words_array = JSON.parse(response.words);
      if (response.following_sens) sens_input = response.following_sens;
      if (response.following_sens_status)
        sens_status = response.following_sens_status;
      if (response.create_sens) create_sens_input = response.create_sens;
      if (response.create_sens_status)
        create_sens_status = response.create_sens_status;
    }
  );
}

async function CreateWrapper() {
  let retry = 0;
  let intervalId = setInterval(async function () {
    cyberPercent = 0;
    const profile = document.querySelector('meta[content="profile"]');
    const moreButton = document.querySelector(
      'div[aria-label="Home timeline"] div[aria-label=More]'
    );
    const cybericheck_wrapper_check = document.querySelector(
      ".cybericheck_wrapper"
    );
    if (retry++ > 10 || (profile && moreButton)) {
      if (!cybericheck_wrapper_check && profile) {
        const cyberycheckWrapper = document.createElement("div");
        const cyberycheck_inner = document.createElement("div");
        cyberycheckWrapper.classList = "cybericheck_wrapper";
        cyberycheck_inner.classList = "cybericheck_inner";
        cyberycheckWrapper.appendChild(cyberycheck_inner);
        moreButton.parentNode.insertBefore(cyberycheckWrapper, moreButton);
      }
      clearInterval(intervalId);
    }
  }, 1000);
}

async function analyze() {
  let retry = 0;
  let intervalId = setInterval(async function () {
    cyberPercent = 0;
    const profile = document.querySelector('meta[content="profile"]');
    const moreButton = document.querySelector(
      'div[aria-label="Home timeline"] div[aria-label=More]'
    );
    let Cyberycheck_inner = document.querySelector(".cybericheck_inner");

    if (
      (retry++ > 10 && profile) ||
      (profile && Cyberycheck_inner && moreButton)
    ) {
      if (words_status) {
        await check_username();
        await check_name();
        await check_description();
        await check_location();
      }
      if (sens_status) await check_followerـdifference();
      if (create_sens_status) await check_joined_date();

      if (!words_status && !sens_status && !create_sens_status) {
        Cyberycheck_inner.innerText = "سایبریاب خاموش است";
        Cyberycheck_inner.setAttribute("style", `background-color : #4e4e4e`);
      } else {
        Cyberycheck_inner.innerText = `${
          cyberPercent < 0 ? 0 : cyberPercent > 100 ? 100 : cyberPercent
        }% ناامن است`;
        Cyberycheck_inner.setAttribute(
          "style",
          `background-color : rgb(${
            cyberPercent > 50
              ? cyberPercent + 155
              : cyberPercent === 0
              ? 0
              : cyberPercent < 30
              ? cyberPercent + 50
              : cyberPercent < 50
              ? cyberPercent + 100
              : cyberPercent
          }, 40, 0);`
        );
      }

      clearInterval(intervalId);
    }
  }, 1000);
}

window.addEventListener("load", async function () {
  await GetDataFromBackground();
  let retry = 0;
  let intervalId = setInterval(async function () {
    const moreButton = document.querySelector(
      'div[aria-label="Home timeline"] div[aria-label=More]'
    );
    if (retry++ > 15 || moreButton) {
      clearInterval(intervalId);
      await CreateWrapper();
      await analyze();
    }
  }, 1000);
});

chrome.runtime.onMessage.addListener(async function (request) {
  if (request.message === "TabUpdated" || request.message === "dataUpdated") {
    cyberPercent = 0;
    await CreateWrapper();
    await analyze();
  }
});
