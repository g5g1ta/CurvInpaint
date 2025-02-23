import { useState } from "react";
import api from "../api";
import './ImageGenerator.css'; 
import { ACCESS_TOKEN } from "../constants";
import { jwtDecode } from "jwt-decode";
import DrawingBoardV2 from "./DrawingBoardV2"; // Import the DrawingBoard

function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [imageStyle, setImageStyle] = useState("realistic"); 
  const [imageShape, setImageShape] = useState("rectangular"); 
  const [generatedImage, setGeneratedImage] = useState(null);
  const [maskBlob, setMaskBlob] = useState(null); // New state for the mask Blob
  const [showDrawingBoard, setShowDrawingBoard] = useState(false); // State to control DrawingBoard visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem(ACCESS_TOKEN);
    const decoded = jwtDecode(token);
    const user_id = decoded["user_id"];
    
    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("user_id", user_id);
      formData.append("style", imageStyle);
      formData.append("shape", imageShape);
      
      // If custom shape is selected, include the mask Blob
      if (imageShape === "custom" && maskBlob) {
        formData.append("mask", maskBlob, "mask.png"); // Adding mask as a file to FormData
      }

      const response = await api.post("api/generateImageV3/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Make sure to set the content type for FormData
        },
      });

      const result = response.data;
      const Base64Image = result.image;
      setGeneratedImage(Base64Image);

      const imgElement = document.createElement('img');
      imgElement.src = Base64Image;
      imgElement.alt = "Generated Image";
      const imageContainer = document.getElementById('image-container');
      imageContainer.appendChild(imgElement);

    } catch (e) {
      console.log(e);
    }
  };

  const handleSaveImage = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const decoded = jwtDecode(token);
    const user_id = decoded["user_id"];
    try {
      const response = await api.post("api/saveImage/", {
        user_id: user_id,
        image_base64: generatedImage,
        headers: {
          'Content-Type' : 'application/json'
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = "generated_image.png";
    link.click();
  };

  const ClearImage = () => {
    setGeneratedImage(null);
    const imageContainer = document.getElementById('image-container');
    imageContainer.innerHTML = '';
  };

  // Handle the mask data from DrawingBoard
  const handleSaveMask = (maskBlob) => {
    setMaskBlob(maskBlob);
  };

  return (
    <div className="image-generator-container">
      <h1>Image Generator</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          value={prompt}
          type="text"
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter prompt"
          className="prompt-input"
        />
        
        {/* Image Style Radio Buttons */}
        <div className="radio-group">
          <label>Choose Image Style:</label>
          <div>
            <label>
              <input
                type="radio"
                name="imageStyle"
                value="realistic"
                checked={imageStyle === "realistic"}
                onChange={(e) => setImageStyle(e.target.value)}
              />
              Realistic
            </label>
            <label>
              <input
                type="radio"
                name="imageStyle"
                value="cartoon"
                checked={imageStyle === "cartoon"}
                onChange={(e) => setImageStyle(e.target.value)}
              />
              Cartoon
            </label>
            <label>
              <input
                type="radio"
                name="imageStyle"
                value="pixelart"
                checked={imageStyle === "pixelart"}
                onChange={(e) => setImageStyle(e.target.value)}
              />
              Pixel Art
            </label>
          </div>
        </div>

        {/* Image Shape Radio Buttons */}
        <div className="radio-group">
          <label>Choose Image Shape:</label>
          <div>
            <label>
              <input
                type="radio"
                name="imageShape"
                value="rectangular"
                checked={imageShape === "rectangular"}
                onChange={(e) => setImageShape(e.target.value)}
              />
              Rectangular
            </label>
            <label>
              <input
                type="radio"
                name="imageShape"
                value="circular"
                checked={imageShape === "circular"}
                onChange={(e) => setImageShape(e.target.value)}
              />
              Circular
            </label>
            <label>
              <input
                type="radio"
                name="imageShape"
                value="custom"
                checked={imageShape === "custom"}
                onChange={() => {
                  setImageShape("custom");
                  setShowDrawingBoard(true); // Show DrawingBoard when "custom" is selected
                }}
              />
              Custom Shape
            </label>
          </div>
        </div>

        <button type="submit" className="submit-button">Generate Image</button>
        {generatedImage && (
          <button type="submit" className="submit-button" onClick={ClearImage}>Clear</button>
        )}
      </form>

      {/* Render DrawingBoard if custom shape is selected */}
      {(showDrawingBoard && generatedImage == null && imageShape == "custom") && (
        <DrawingBoardV2 onSave={handleSaveMask} />
      )}

      {generatedImage && (
        <div className="save-button-container">
          <button onClick={handleSaveImage} className="save-button">Save Image</button>
        </div>
      )}

      <div id="image-container" className="image-container"></div>

      {generatedImage && (
        <div className="save-button-container">
          <button onClick={downloadImage} className="save-button">Download Image</button>
        </div>
      )}
    </div>
  );
}

export default ImageGenerator;
