chrome.runtime.onInstalled.addListener(() => {
    // Create the context menu item
        chrome.contextMenus.create({
            id: "uploadImage",
            title: "Predict Image Authenticity",
            contexts: ["image"],
        });
    });
    
    
    // Declare a variable to store the reference to the popup window
    let popupWindowId = false;

    // Listen for right-click menu item click event
    chrome.contextMenus.onClicked.addListener(function(clickData) {
      if (clickData.menuItemId === "uploadImage") {
        // Upload the image to the extension
        if (popupWindowId) {
          // If the popup window is already open, refresh it
          chrome.windows.update(popupWindowId, { focused: true }, function() {
            chrome.runtime.sendMessage({ action: "uploadImage", imageURL: clickData.srcUrl });
            console.log("Message sent to popup window");
          });
        } else {
          // If the popup window is not open, create a new one
          chrome.windows.create({
            url: "popup.html",
            type: "popup",
            width: 460,
            height: 460
          }, function(window) {
            // Store the window ID for future reference
            popupWindowId = window.id;
            console.log("Popup window created.");

            // Wait for 2 seconds before sending the message
            setTimeout(function() {
              chrome.runtime.sendMessage({ action: "uploadImage", imageURL: clickData.srcUrl });
              console.log("Message sent to popup window after 2 seconds");
            }, 2000);
          });
        }
      }
    });

    // Listen for the popup window to close
    chrome.windows.onRemoved.addListener(function(windowId) {
      if (windowId === popupWindowId) {
        // Reset the popupWindowId when the popup window is closed
        popupWindowId = false;
      }
    });
    
    
    