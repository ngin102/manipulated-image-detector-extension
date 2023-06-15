# Manipulated Image Detector Extension

[Click to see the Chrome Web Store listing for this extension.](https://chrome.google.com/webstore/detail/manipulated-image-detecto/ieooocebljbioibcclgcmkpfpjbcaijg)

Predict if an image on a webpage is authentic or if it has been manipulated using a model built for this purpose.
Right from your Chrome browser, predict if an image on a webpage is authentic or if it has been manipulated using a model built for this purpose!

The Manipulated Image Detector is a Chrome extension that utilizes an on-device model specifically designed to detect any potential manipulation or editing in an image. This model is loaded using TensorFlow.js scripts.

How to Use:
To predict the authenticity of an image from a webpage using the model, simply secondary-click (right-click) on the desired image and choose "Predict Image Authenticity" from the Context Menu. This action will activate a pop-up window displaying the "Manipulated Image Detector." The image will be promptly submitted to the detector, which will then provide a prediction regarding its authenticity. Once you launch this window, it will receive automated notifications to stay active every 25 seconds (until you close it), so it can update in real-time when a new image is uploaded to the detector.

How Does It Work:
This model is a custom convolutional neural network that was trained on 3938 authentic images and 3938 manipulated images from the CASIA2 dataset. It predicts the authenticity of an image using what it learned to be distinguishing variables between manipulated and authentic images throughout the training process.

Note that this model is not foolproof. It achieved an F1 score of approximately 87.3% when tested on another subset of images it was not trained on from the CASIA2 dataset. While it makes informed predictions based on evidence and what it has learned, it is important to understand that the model's predictions are still predictions! It should be used as a tool, not as fact.

Click on the image below for a video demo of the extension:

[![Manipulated Image Detector Demo](https://img.youtube.com/vi/ivoX-HomIR4/0.jpg)](https://youtu.be/ivoX-HomIR4 "Manipulated Image Detector Demo")
