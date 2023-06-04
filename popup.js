// Preprocesses an image before it is given to the model to ensure consistency
// across all images that the model is learning off of.
function preprocessImage(image_element) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Set the canvas size to match the image size.
  // (The original model was trained on images of dimensions 256 x 256).
  canvas.width = 256;
  canvas.height = 256;

  // Draw the image on the canvas.
  ctx.drawImage(image_element, 0, 0, 256, 256);

  // Get the pixel data from the canvas.
  const image_data = ctx.getImageData(0, 0, 256, 256).data;

  // Normalize and convert the pixel values to the desired format.
  const image_buffer = new Float32Array(256 * 256 * 3);
  let offset = 0;
  for (let i = 0; i < image_data.length; i += 4) {
      const r = image_data[i] / 255.0;
      const g = image_data[i + 1] / 255.0;
      const b = image_data[i + 2] / 255.0;

      image_buffer[offset] = r;
      image_buffer[offset + 1] = g;
      image_buffer[offset + 2] = b;

      offset += 3;
  }

  // Return the preprocessed image buffer.
  return image_buffer;
}

async function classifyImage(imageElement, model) {
  const input_buffer = preprocessImage(imageElement);
  const input_tensor = tf.tensor4d(input_buffer, [1, 256, 256, 3]);
  const output_tensor = model.predict(input_tensor);
  const output = await output_tensor.data();
  output_tensor.dispose();

  // Scale up the prediction values and convert to percentages
  const rescaled_values = output.map(value => (value * 100).toFixed(2));
  
  const predictionDiv = document.getElementById("predictions");

  if (rescaled_values[0] < 50)
  {
      predictionDiv.textContent = "Prediction: Likely Manipulated";
  }
  else
  {
      predictionDiv.textContent = "Prediction: Likely Authentic";
  }

  return rescaled_values;
}

// Load the JSON model and perform classification
async function loadModelAndClassify(image_element) {
  const model = await tf.loadLayersModel("model.json");
  console.log("Model loaded");

  const outputData = await classifyImage(image_element, model);
  console.log("Prediction made");

  // Clean up
  model.dispose();
}

// Function to handle file upload
async function handleFileUpload(event) {
  const file = event.target.files[0];

  const reader = new FileReader();
  reader.onload = async function(e) {
      const image_url = e.target.result;
      const image_element = document.createElement("img");
      image_element.src = image_url;

      // Wait for image to load before making predictions
      image_element.onload = async function() {
          const canvas = document.createElement("canvas");
          canvas.width = 256;
          canvas.height = 256;
          const context = canvas.getContext("2d");
          context.drawImage(image_element, 0, 0, 256, 256);

          const resized_image = new Image();
          resized_image.src = canvas.toDataURL("image/jpeg");

          const image_div = document.getElementById("uploaded_image");
          
          image_div.innerHTML = "";

          const prediction_div = document.getElementById("predictions");
          prediction_div.textContent = "Predicting authenticity...";


          image_div.appendChild(image_element);

          await loadModelAndClassify(image_element);
      };

      URL.revokeObjectURL(image_url);
  };

  reader.readAsDataURL(file);
}

async function handleFileUploadFromMenu(file) {
  const reader = new FileReader();
  reader.onload = async function(e) {
    const image_url = e.target.result;
    const image_element = document.createElement("img");
    image_element.src = image_url;

    // Wait for image to load before making predictions
    image_element.onload = async function() {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const context = canvas.getContext("2d");
      context.drawImage(image_element, 0, 0, 256, 256);

      const resized_image = new Image();
      resized_image.src = canvas.toDataURL("image/jpeg");

      const image_div = document.getElementById("uploaded_image");
      image_div.innerHTML = "";


      const prediction_div = document.getElementById("predictions");
      prediction_div.textContent = "Predicting authenticity...";


      image_div.appendChild(image_element);

      await loadModelAndClassify(image_element);
    };

    URL.revokeObjectURL(image_url);
  };

  reader.readAsDataURL(file);
}


// Call handleFileUpload function when an image file is selected.
const fileInput = document.getElementById("file-input");
fileInput.addEventListener("change", handleFileUpload);

// Add event listener for message event
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "uploadImage") {
    const imageURL = request.imageURL;
    console.log("Message received in background script:", imageURL);

    // Process the message and perform the desired actions
    fetch(imageURL)
      .then(response => response.blob())
      .then(blob => {
        const file = new File([blob], "selected_image.png", { type: "image/png" });

        handleFileUploadFromMenu(file);

        // Send a response if needed
        sendResponse("Message processed successfully");
      })
      .catch(error => {
        console.error("Error extracting image file:", error);
        // Send a response if needed
        sendResponse("Error processing message: " + error.message);
      });

    // Return true to indicate that the response will be sent asynchronously
    return true;
  }
});

