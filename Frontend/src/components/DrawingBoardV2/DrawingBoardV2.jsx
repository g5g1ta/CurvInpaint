import React, { useEffect, useRef, useState } from 'react';

const DrawingBoardV2 = ({ onSave }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState("brush"); // Default tool
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState("white");

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 500;
    canvas.height = 500;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
    contextRef.current = context;

    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height); 
  }, [brushSize, brushColor]); 

  const getMousePosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  };

  const startDrawing = (e) => {
    const { x, y } = getMousePosition(e);
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);

    if (currentTool === "fill") {
      fillColor(x, y); 
    } else {
      setIsDrawing(true);
    }
  };

  const draw = (e) => {
    if (!isDrawing || currentTool === "fill") return;

    const { x, y } = getMousePosition(e);
    if (currentTool === "brush") {
      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();
    } else if (currentTool === "eraser") {
      contextRef.current.clearRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
    }
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  
  const fillColor = (x, y) => {
    const canvas = canvasRef.current;
    const context = contextRef.current;

    const targetColor = context.getImageData(x, y, 1, 1).data;
    const targetRGB = `rgb(${targetColor[0]},${targetColor[1]},${targetColor[2]})`;

    
    const stack = [[x, y]];

    while (stack.length) {
      const [cx, cy] = stack.pop();
      if (context.getImageData(cx, cy, 1, 1).data.toString() === targetColor.toString()) {
        context.fillStyle = brushColor;
        context.fillRect(cx, cy, 1, 1);
        stack.push([cx + 1, cy]);
        stack.push([cx - 1, cy]);
        stack.push([cx, cy + 1]);
        stack.push([cx, cy - 1]);
      }
    }
  };

  const handleSaveDrawing = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      onSave(blob);  
    }, "image/png");
  };

  return (
    <div>
      
      <div>
        <button onClick={() => setCurrentTool("brush")}>Brush</button>
        <button onClick={() => setCurrentTool("fill")}>Fill</button>
        <button onClick={() => setCurrentTool("eraser")}>Eraser</button>
      </div>

     
      <div>
        <label>Brush Size: </label>
        <input 
          type="range" 
          min="1" 
          max="20" 
          value={brushSize} 
          onChange={(e) => setBrushSize(e.target.value)} 
        />
        <label>Brush Color: </label>
        <input 
          type="color" 
          value={brushColor} 
          onChange={(e) => setBrushColor(e.target.value)} 
        />
      </div>

      
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ border: '1px solid #fff' }}
      />

      
      <div>
        <button onClick={handleSaveDrawing}>Save Custom Shape</button>
      </div>
    </div>
  );
};

export default DrawingBoardV2;
