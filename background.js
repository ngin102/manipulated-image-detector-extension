chrome.runtime.onInstalled.addListener(() => {
    // Create the context menu item
        chrome.contextMenus.create({
            id: "uploadImage",
            title: "Predict Image Authenticity",
            contexts: ["image"],
        });
    });
    
    
    let popupWindowId = false;
    
    // Listen for right-click menu item click event
    chrome.contextMenus.onClicked.addListener(function(clickData) {
        if (clickData.menuItemId === "uploadImage") {
          // Upload the image to the extension
          const imageURL = clickData.srcUrl;
            if (popupWindowId) {
                // If the popup window is already open, refresh it
                chrome.windows.update(popupWindowId, { focused: true }, function() {
                    const views = chrome.extension.getViews({ windowId: popupWindowId });
                    if (views.length > 0) {
                        const popupWindow = views[0];
                        popupWindow.postMessage({ action: "uploadImage", imageURL: clickData.srcUrl }, "*");
                        console.log("Message sent", popupWindowId);
                      }
    
                });
    
            } else {
                chrome.windows.create({
                    url: "popup.html",
                    type: "popup",
                    width: 460,
                    height: 460
                  }, function(window) {
                    // Store the window ID for future reference
                    popupWindowId = window.id;
                  
                    console.log("Window created.");
                  
                    // Wait for 40 seconds before sending the message
                    setTimeout(function() {
                      const views = chrome.extension.getViews({ windowId: popupWindowId });
                      if (views.length > 0) {
                        const popupWindow = views[0];
                        popupWindow.postMessage({ action: "uploadImage", imageURL: clickData.srcUrl }, "*");
                        console.log("Message sent after 2 seconds:", popupWindowId);
                      }
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
    
    
    