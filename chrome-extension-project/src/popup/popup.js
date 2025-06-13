document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("action-button");
  button.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "buttonClicked" });
    });
  });
});
