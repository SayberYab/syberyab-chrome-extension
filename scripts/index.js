function words_body_item(wrapper, text, words) {
  const item = document.createElement("div");
  const itemicon = document.createElement("span");
  itemicon.className = "material-icons";
  itemicon.innerHTML = "&#xe5cd;";
  item.className = "add-word-body-item";

  item.addEventListener("click", function () {
    item.remove();
    const temp = new Set(JSON.parse(words));
    temp.delete(text);
    chrome.storage.sync.set(
      { "cyber-words": JSON.stringify(Array.from(temp)) },
      function () {
        addInput.value = "";
      }
    );
  });
  item.innerText = text;
  item.appendChild(itemicon);
  wrapper.appendChild(item);
}

const addWord = document.querySelector(".add-word");
addWord.addEventListener("click", function () {
  fetch("./pages/addword.html")
    .then((response) => response.text())
    .then(
      (text) => (document.querySelector(".change-wrapper").innerHTML = text)
    );
  var retry = 0;
  var intervalId = setInterval(function () {
    const addButton = document.querySelector(".add-word-header > button");
    const addInput = document.querySelector(".add-word-header > input");
    const import_word = document.querySelector(".import-word");
    const export_word = document.querySelector(".export-word");
    const notifclose = document.querySelector(".notif > .close");
    const notifclosewrapper = document.querySelector(".notif-wrapper");
    const addwordlistinput = document.querySelector(".addwordlist > input");
    const addwordlistwrapper_close =
      document.querySelector(".addwordlist-close");
    const addwordlistwrapper = document.querySelector(
      ".addwordlist-wrapper-close"
    );
    const words_body = document.querySelector(".add-word-body");
    let words = null;
    chrome.storage.sync.get(["cyber-words"], function (result) {
      console.log(result);
      if (
        !result["cyber-words"] ||
        !JSON.parse(result["cyber-words"]).length > 0
      ) {
        words_body.innerHTML = "موردی یافت نشد";
      }
      if (
        result &&
        result["cyber-words"] &&
        JSON.parse(result["cyber-words"]).length > 0
      ) {
        words = result["cyber-words"];
        words_body.innerHTML = "";
        const temp = new Set(JSON.parse(words));
        console.log(temp);
        temp.forEach((element) => {
          words_body_item(words_body, element, words);
        });
      }
    });

    function additemtowords() {
      if (words && JSON.parse(words).length > 0 && addInput.value) {
        const temp = new Set(JSON.parse(words));
        temp.add(addInput.value);
        words_body_item(words_body, addInput.value);
        chrome.storage.sync.set(
          { "cyber-words": JSON.stringify(Array.from(temp)) },
          function () {
            addInput.value = "";
          }
        );
      } else if (addInput.value) {
        const temp = new Set([]);
        temp.add(addInput.value);
        words_body_item(words_body, addInput.value);
        chrome.storage.sync.set(
          { "cyber-words": JSON.stringify(Array.from(temp)) },
          function () {
            addInput.value = "";
          }
        );
      }
    }

    addInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") additemtowords();
    });

    addButton.addEventListener("click", additemtowords);

    import_word.addEventListener("click", function () {
      document.querySelector(".addwordlist-wrapper").style.display = "flex";
    });

    export_word.addEventListener("click", function () {
      // Get the text field
      let copyText = document.getElementById("myInput");
      copyText.value = words;

      // Select the text field
      copyText.select();
      copyText.setSelectionRange(0, 99999); // For mobile devices

      // Copy the text inside the text field
      navigator.clipboard.writeText(copyText.value);

      // Alert the copied text
      // alert("Copied the text: " + copyText.value);
      document.querySelector(".notif-wrapper").style.display = "flex";
    });
    notifclose.addEventListener("click", function () {
      document.querySelector(".notif-wrapper").style.display = "none";
    });
    notifclosewrapper.addEventListener("click", function () {
      document.querySelector(".notif-wrapper").style.display = "none";
    });
    addwordlistwrapper.addEventListener("click", function () {
      document.querySelector(".addwordlist-wrapper").style.display = "none";
    });
    addwordlistwrapper_close.addEventListener("click", function () {
      document.querySelector(".addwordlist-wrapper").style.display = "none";
      const inputlistword = new Set(JSON.parse(addwordlistinput.value));
      const temp = new Set(JSON.parse(words));
      const finalwordlist = new Set([...inputlistword, ...temp]);
      chrome.storage.sync.set(
        { "cyber-words": JSON.stringify(Array.from(finalwordlist)) },
        function () {
          addInput.value = "";
        }
      );
      chrome.storage.sync.get(["cyber-words"], function (result) {
        console.log(result);
        if (
          !result["cyber-words"] ||
          !JSON.parse(result["cyber-words"]).length > 0
        ) {
          words_body.innerHTML = "موردی یافت نشد";
        }
        if (
          result &&
          result["cyber-words"] &&
          JSON.parse(result["cyber-words"]).length > 0
        ) {
          words = result["cyber-words"];
          words_body.innerHTML = "";
          const temp = new Set(JSON.parse(words));
          console.log(temp);
          temp.forEach((element) => {
            words_body_item(words_body, element, words);
          });
        }
      });
    });

    if (retry++ > 15 || words_body) clearInterval(intervalId);
  }, 1000);
});
