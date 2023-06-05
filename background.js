chrome.runtime.onInstalled.addListener(() => {
  // Create the Context Menu item
  chrome.contextMenus.create({
    id: "uploadImage",
    title: "Predict Image Authenticity",
    contexts: ["image"],
  });
});

let popupWindowId = null;
let intervalId = null;

// Refresh the popup window if it already exists.
function refreshPopupWindow(clickData) {
  console.log("Refreshing popup window");
  chrome.windows.get(popupWindowId, { populate: true }, function (window) {
    if (chrome.runtime.lastError || !window) {
      // To be extra cautious: if the window doesn't exist, reset the popupWindowId.
      popupWindowId = null;
      console.log("Popup window doesn't exist. Resetting popupWindowId:", popupWindowId);
      createPopupWindow(clickData);
    } 
    else {
      console.log("Popup window exists. popupWindowId:",  popupWindowId);
      // If the window exists, update its focus and send the message that the image has been uploaded.
      chrome.windows.update(popupWindowId, { focused: true }, function () {
        chrome.runtime.sendMessage({ action: "uploadImage", imageURL: clickData.srcUrl });
        console.log("Message sent to popup window");
      });
    }
  });
}

// Function to create a new popup window
function createPopupWindow(clickData) {
  console.log("Creating new popup window");
  chrome.windows.create({
    url: "popup.html",
    type: "popup",
    width: 460,
    height: 460
  }, function (window) {
    // Store the window ID, so we know that it has been created and it is opened.
    popupWindowId = window.id;
    console.log("New popup window created with ID:", popupWindowId);
    
    // Wait for 2 seconds before sending the message.
    setTimeout(function () {
      chrome.runtime.sendMessage({ action: "uploadImage", imageURL: clickData.srcUrl });
      console.log("Message sent to popup window after 2 seconds");
    }, 2000);
  });
}

// Listen for secondary-click menu item click event
chrome.contextMenus.onClicked.addListener(function (clickData) {
  if (clickData.menuItemId === "uploadImage") {
    if (popupWindowId) {
      console.log("Popup window exists. popupWindowId:",  popupWindowId);
      // If the popup window ID exists, refresh the window
      refreshPopupWindow(clickData);
    } 
    else {
      console.log("Popup window does not exist. popupWindowId:",  popupWindowId);
      // If the popup window ID doesn't exist, create a new window
      createPopupWindow(clickData);
      intervalId = true;

      intervalId = setInterval(function () {
        chrome.runtime.sendMessage({ action: "keepAlive" });
        console.log("Keep-alive message sent to popup window");
      }, 3000);
    }
  }
});

// Listen for the popup window to close
chrome.windows.onRemoved.addListener(function (windowId) {
  if (windowId === popupWindowId) {
    clearInterval(intervalId);
    console.log("Popup window closed. Resetting intervalId:", intervalId);

    popupWindowId = null;
    console.log("Popup window closed. Resetting popupWindowId:", popupWindowId);
  }
});