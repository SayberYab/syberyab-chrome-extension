let cyberPercent = 0;
window.addEventListener("load", function () {
  const url = window.location.href;
  const isProfile = url.split("/").length < 6;
  const username = url.split("/")[3];
  console.log(isProfile, url, url.split("/").length);
  if (url && isProfile) {
    console.log("loaded");
    var retry = 0;
    var intervalId = setInterval(function () {
      console.log("try");
      const tabWrapper = document.querySelector('div[role="tablist"]');
      const tab = document.createElement("div");
      const tabLink_style = document.querySelector(
        'div[role="tablist"] div[role="presentation"] a[aria-selected="false"]'
      );
      const tabLink_div_style = document.querySelector(
        'div[role="tablist"] div[role="presentation"] a[aria-selected="false"] > div'
      );
      const tabLink_div_span_style = document.querySelector(
        'div[role="tablist"] div[role="presentation"] a[aria-selected="false"] > div > span'
      );
      const tabLink_div_div_style = document.querySelector(
        'div[role="tablist"] div[role="presentation"] a[aria-selected="false"] > div > div'
      );
      const tabLink = document.createElement("a");
      const tabLink_div = document.createElement("div");
      const tabLink_div_span = document.createElement("span");
      const tabLink_div_div = document.createElement("div");

      const cyberycheckWrapper = document.createElement("div");
      const cyberycheck_inner = document.createElement("div");
      const cyberycheck_icon = document.createElement("span");

      let joinedDate = document.querySelector("span[data-testid=UserJoinDate]");

      const moreButton = document.querySelector(
        'div[aria-label="Home timeline"] div[aria-label=More]'
      );

      if (
        tabWrapper &&
        tabLink_style &&
        tabLink_div_style &&
        tabLink_div_span_style &&
        tabLink_div_div_style &&
        moreButton &&
        joinedDate
      ) {
        clearInterval(intervalId);

        console.log("ok");
        tab.setAttribute("role", "presentation");
        tab.classList.add("css-1dbjc4n");
        tab.classList.add("r-16y2uox");
        tab.classList.add("r-6b64d0");
        tab.classList.add("r-cpa5s6");

        tabLink.setAttribute("href", "#");
        tabLink.setAttribute("role", "tab");
        tabLink.className = tabLink_style.className;
        tabLink_div.setAttribute("dir", "auto");
        tabLink_div.className = tabLink_div_style.className;
        tabLink_div_span.className = tabLink_div_span_style.className;
        tabLink_div_span.innerText = "Anticyberi";
        tabLink_div_div.className = tabLink_div_div_style.className;
        tabLink_div.appendChild(tabLink_div_span);
        tabLink_div.appendChild(tabLink_div_div);
        tabLink.appendChild(tabLink_div);
        tab.appendChild(tabLink);
        tab.addEventListener("click", setTabContent);

        tabWrapper.appendChild(tab);

        cyberycheckWrapper.classList = "cybericheck_wrapper";
        cyberycheck_inner.classList = "cybericheck_inner";

        //
        //Cyber percent
        //

        //check joined date
        const nowYear = new Date().getFullYear();
        joinedDate = parseInt(joinedDate.innerText.replace(/^\D+/g, ""));
        if (nowYear && joinedDate && nowYear != joinedDate)
          cyberPercent -= nowYear - joinedDate;
        if (nowYear && joinedDate && nowYear == joinedDate) cyberPercent += 10;

        //check name
        const checkWords = ["انقلاب", "ولایت", "🇮🇷", "سادات"];
        let name = document.querySelector("title");
        if (name) {
          for (let i = 0; i < checkWords.length; i++) {
            if (name.innerText.includes(checkWords[i])) {
              cyberPercent += 30;
              console.log(checkWords[i]);
            }
          }
        }

        //check username
        const usernamecheckWords = [
          "enghelab",
          "enqelab",
          "engelab",
          "iran",
          "sadat",
          "313",
          "14",
          "13",
        ];
        console.log(username);
        if (username) {
          for (let i = 0; i < usernamecheckWords.length; i++) {
            if (username.includes(usernamecheckWords[i])) {
              cyberPercent += 30;
              console.log(usernamecheckWords[i]);
            }
          }
        }

        //check description
        const descriptioncheckWords = [
          "انقلاب",
          "ولایت",
          "🇮🇷",
          "سادات",
          "الفرج",
          "الهم عجل لولیک الفرج",
          "iran",
          "علیه سلام",
          "شهادت",
          "بنده",
          "طلبه",
          "عجل",
          "الفرج",
          "الله",
          "برانداز",
          "(ع)",
          "(ص)",
          "(س)",
          "وطن",
          "یامهدی",
          "الليلة",
        ];
        let description = document.querySelector(
          "div[data-testid=UserDescription]"
        );
        if (description) {
          for (let i = 0; i < descriptioncheckWords.length; i++) {
            if (description.innerText.includes(descriptioncheckWords[i])) {
              cyberPercent += 10;
              console.log(descriptioncheckWords[i]);
            }
          }
        }

        //check location
        const locationcheckWords = ["اسلامی", "فرمان", "رهبر", "خدا"];
        let location = document.querySelector(
          "div[data-testid=UserDescription]"
        );
        if (location) {
          for (let i = 0; i < locationcheckWords.length; i++) {
            if (location.innerText.includes(locationcheckWords[i])) {
              cyberPercent += 10;
              console.log(locationcheckWords[i]);
            }
          }
        }

        cyberycheck_inner.setAttribute(
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
        cyberycheck_inner.innerText = `${
          cyberPercent < 0 ? 0 : cyberPercent > 100 ? 100 : cyberPercent
        }% ناامن است`;

        // cyberycheckWrapper.appendChild(cyberycheck_icon);
        cyberycheckWrapper.appendChild(cyberycheck_inner);
        moreButton.parentNode.insertBefore(cyberycheckWrapper, moreButton);
      }

      if (retry++ > 15) clearInterval(intervalId);
    }, 1000);
  }
});

function setTabContent() {
  const tabContentWrapper = document.querySelector("section[role=region]");
  if (tabContentWrapper) {
    tabContentWrapper.innerHTML = "";
  }
}
