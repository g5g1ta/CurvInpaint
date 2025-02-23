import React, { useEffect, useRef, useState } from 'react';
import "../components/Drawing.css";
import api from '../api';

const DrawingBoard = ({onSave}) => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [image, setImage] = useState(null); 

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 500;  
        canvas.height = 500; 

        const context = canvas.getContext("2d");
        context.lineCap = "round";
        context.strokeStyle = "white"; 
        context.lineWidth = 5;
        contextRef.current = context;

        
        if (!image) {
            context.fillStyle = "black";
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
    }, [image]); 

    const getMousePosition = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect(); // Get canvas position relative to page
        const x = e.clientX - rect.left;  // Adjust to canvas position
        const y = e.clientY - rect.top;   // Adjust to canvas position
        return { x, y };
    };

    const startDrawing = (e) => {
        const { x, y } = getMousePosition(e);
        contextRef.current.beginPath();
        contextRef.current.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;

        const { x, y } = getMousePosition(e);
        contextRef.current.lineTo(x, y);
        contextRef.current.stroke();
    };

    const stopDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
    };

   
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    setImage(img); 
                };
            };
            reader.readAsDataURL(file);
        }
    };
    function base64ToBlob(base64Data, mimeType) {
        const byteCharacters = atob(base64Data.split(',')[1]);  
        const byteArrays = [];
        
        for (let offset = 0; offset < byteCharacters.length; offset++) {
            const byte = byteCharacters.charCodeAt(offset);
            byteArrays.push(byte);
        }
    
        return new Blob([new Uint8Array(byteArrays)], { type: mimeType });
    }

    
    const saveImage = async (event) => {       
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

       
        const newCanvas = document.createElement("canvas");
        const newContext = newCanvas.getContext("2d");

        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;

        newContext.fillStyle = "black";
        newContext.fillRect(0, 0, canvas.width, canvas.height);
        newContext.drawImage(canvas, 0, 0);

        const finalImage = newCanvas.toDataURL("image/png");
        const original_iamge = image.src;

        const formData = new FormData();
        const originalImageBlob = base64ToBlob(original_iamge, "image/png");
        const canvasBlob = base64ToBlob(finalImage, "image/png");

        formData.append("original_image", originalImageBlob);
        formData.append("mask_image", canvasBlob);

        try {
            
            const formData = new FormData();
            formData.append('original_image', originalImageBlob);
            formData.append('mask_image', canvasBlob);
        
            
            const response = await api.post('api/inpaint/', formData);
        
            if (response.status === 200) {
                const result = response.data;
                const inpaintedImageBase64 = result.inpainted_image;
        
                
                const resultUrl = inpaintedImageBase64;
                const imgElement = document.createElement('img');
                imgElement.src = inpaintedImageBase64;
                imgElement.alt = "Inpainted Image";
        
                const downloadButton = document.createElement('button');
                downloadButton.textContent = "Download Inpainted Image";
                downloadButton.addEventListener('click', () => {
                    const link = document.createElement('a');
                    link.href = inpaintedImageBase64;
                    link.download = "inpainted_image.png";
                    link.click();
                });
        
                
                const imageContainer = document.getElementById('inpainted-image-container');
                imageContainer.innerHTML = ''; 
                imageContainer.appendChild(imgElement);
                imageContainer.appendChild(downloadButton);
            } else {
                alert('Error in image processing');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong.');
        }
        
    };

    return (
        <div>
            {}
            <div
                style={{
                    width: '500px',
                    height: '500px',
                    backgroundImage: image ? `url(${image.src})` : 'none', 

                    backgroundSize: '100% 100%', 
                    backgroundPosition: 'center',
                    position: 'relative',
                }}
            >
                <canvas
                    className="canvas-container"
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}  
                    style={{ position: 'absolute', top: 0, left: 0 }}
                />
            </div>

            {}
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ marginTop: '20px' }}
            />

            {}
            <a
                id="download_image_link"
                href="#"
                onClick={saveImage}
                style={{ display: 'block', marginTop: '20px' }}
            >
                Inpaint
            </a>
            <div id="inpainted-image-container">

            </div>
        </div>
    );
};

export default DrawingBoard;