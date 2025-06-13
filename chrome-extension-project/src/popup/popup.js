document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("action-button");
  
    button.addEventListener("click", async function () {
      // Step 1: Get the active tab
      chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        const tab = tabs[0];
  
        // Step 2: Capture the visible tab as a base64 PNG
        chrome.tabs.captureVisibleTab(null, { format: "png" }, function (screenshotDataUrl) {
          if (chrome.runtime.lastError) {
            alert("Error capturing screenshot: " + chrome.runtime.lastError.message);
            return;
          }
  
          // Step 3: Send the screenshot + action message to content script
          chrome.tabs.sendMessage(tab.id, {
            action: "buttonClicked",
            screenshot: screenshotDataUrl, // This is a data URL, e.g. "data:image/png;base64,..."
          });
        });
      });
    });
  });
  