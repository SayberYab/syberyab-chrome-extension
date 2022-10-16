let cyberPercent = 0;
let words_array = null;
let words_status = false;
let sens_input = 0;
let sens_status = false;
let create_sens_input = 0;
let create_sens_status = false;

async function check_joined_date() {
  // check joined date
  let joinedDate = document.querySelector("span[data-testid=UserJoinDate]");
  joinedDate = joinedDate.innerText.replace(/^\D+/g, "");
  joinedDate = joinedDate && parseInt(joinedDate);
  console.log(joinedDate);
  console.log(joinedDate - create_sens_input);
  if (joinedDate && create_sens_input && joinedDate > create_sens_input) {
    cyberPercent += joinedDate - create_sens_input;
  }
}

async function check_name() {
  // check name
  let name = document.querySelector("title");
  if (name) {
    for (let i = 0; i < words_array.length; i++) {
      if (name.innerText.includes(words_array[i])) {
        cyberPercent += 30;
      }
    }
  }
}

async function check_username() {
  const url = window.location.href;
  const username = url.split("/")[3];
  //check username
  if (username) {
    for (let i = 0; i < words_array.length; i++) {
      if (username.includes(words_array[i])) {
        cyberPercent += 30;
      }
    }
  }
}

async function check_description() {
  //check description
  let description = document.querySelector("div[data-testid=UserDescription]");
  if (description) {
    for (let i = 0; i < words_array.length; i++) {
      if (description.innerText.includes(words_array[i])) {
        cyberPercent += 10;
        console.log(words_array[i]);
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
  let location = document.querySelector("div[data-testid=UserLocation]");
  if (location) {
    for (let i = 0; i < words_array.length; i++) {
      if (location.innerText.includes(words_array[i])) {
        cyberPercent += 10;
        console.log(words_array[i]);
      }
    }
  }
}

async function GetDataFromBackground() {
  await chrome.runtime.sendMessage(
    { message: "get-data" },
    function (response) {
      console.log(response);
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
      if (!cybericheck_wrapper_check) {
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

    if (retry++ > 10 || (profile && Cyberycheck_inner && moreButton)) {
      if (words_status) {
        await check_username();
        await check_name();
        await check_description();
        await check_location();
      }
      if (sens_status) await check_followerـdifference();
      if (create_sens_status) await check_joined_date();
      console.log("updated 152");
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
  if (request.message === "TabUpdated") {
    cyberPercent = 0;
    await CreateWrapper();
    await analyze();
  }
});
