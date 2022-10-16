let cyberPercent = 0;
let Cyberstatus = true;
let words_array = null;
let sens_input = 0;

async function check_joined_date() {
  // check joined date
  const nowYear = new Date().getFullYear();
  let joinedDate = document.querySelector("span[data-testid=UserJoinDate]");
  joinedDate = joinedDate.innerText.replace(/^\D+/g, "");
  joinedDate = joinedDate && parseInt(joinedDate);
  if (nowYear && joinedDate && nowYear != joinedDate)
    cyberPercent -= nowYear - joinedDate;
  if (nowYear && joinedDate && nowYear == joinedDate) cyberPercent += 10;
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
      cyberPercent =
        sens_final > 50
          ? cyberPercent + 40
          : cyberPercent < 50
          ? cyberPercent + 30
          : cyberPercent + 20;
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
    { message: "get-words" },
    function (response) {
      if (response && response.words) {
        words_array = JSON.parse(response.words);
      }
    }
  );
  await chrome.runtime.sendMessage(
    { message: "get-following-sens" },
    function (response) {
      if (response && response.sens_input) {
        sens_input = response.sens_input;
      }
    }
  );
}

async function CreateWrapper(moreButton) {
  const cyberycheckWrapper = document.createElement("div");
  const cyberycheck_inner = document.createElement("div");
  cyberycheckWrapper.classList = "cybericheck_wrapper";
  cyberycheck_inner.classList = "cybericheck_inner";
  cyberycheckWrapper.appendChild(cyberycheck_inner);
  cyberycheck_inner.innerHTML = `
  <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>`;
  await moreButton.parentNode.insertBefore(cyberycheckWrapper, moreButton);
}

async function analyze() {
  cyberPercent = 0;
  let Cyberycheck_inner = document.querySelector(".cybericheck_inner");
  Cyberycheck_inner.innerHTML = `
  <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>`;
  await check_username();
  await check_name();
  await check_description();
  await check_location();
  await check_joined_date();
  await check_followerـdifference();
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
}

window.addEventListener("load", async function () {
  await GetDataFromBackground();
  var retry = 0;
  var intervalId = setInterval(async function () {
    const moreButton = document.querySelector(
      'div[aria-label="Home timeline"] div[aria-label=More]'
    );
    if (retry++ > 15 || moreButton) {
      clearInterval(intervalId);
      await CreateWrapper(moreButton);
      await analyze();
    }
  }, 1000);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "TabUpdated") analyze();
});
