import React, { useRef, useEffect, useState } from 'react';

export default function ScratchCardCanvas({ children, width, height, image, onComplete, finishPercent = 50 }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    setCtx(context);

    // Draw the cover image or solid color
    if (image) {
      const img = new Image();
      img.onload = () => {
        // Fill background first in case image has transparency
        context.fillStyle = '#0a0a0a';
        context.fillRect(0, 0, width, height);
        context.drawImage(img, 0, 0, width, height);
      };
      img.src = image;
    } else {
      // Draw a gold/red gradient if no image is provided
      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#ffd700');
      gradient.addColorStop(0.5, '#e60000');
      gradient.addColorStop(1, '#0a0a0a');
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
      
      // Add text
      context.fillStyle = '#ffffff';
      context.font = 'bold 24px sans-serif';
      context.textAlign = 'center';
      context.fillText('SCRATCH HERE', width / 2, height / 2);
    }
  }, [width, height, image]);

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    return { x, y };
  };

  const handlePointerDown = (e) => {
    if (isFinished) return;
    setIsDrawing(true);
    const { x, y } = getMousePos(e);
    if (ctx) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2, false);
      ctx.fill();
    }
  };

  const handlePointerMove = (e) => {
    if (!isDrawing || isFinished) return;
    const { x, y } = getMousePos(e);
    if (ctx) {
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2, false); // Increase brush size slightly when moving
      ctx.fill();
      checkCompletion();
    }
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const checkCompletion = () => {
    if (!ctx) return;
    const canvas = canvasRef.current;
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    // Check alpha channel for transparency (every 4th value)
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    const totalPixels = pixels.length / 4;
    const percent = (transparentPixels / totalPixels) * 100;

    if (percent >= finishPercent && !isFinished) {
      setIsFinished(true);
      // Clear remaining canvas with animation
      canvas.style.transition = 'opacity 0.5s ease';
      canvas.style.opacity = '0';
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative select-none" 
      style={{ width, height, overflow: 'hidden', borderRadius: '16px' }}
    >
      {/* Background Content (The Prize) */}
      <div className="absolute inset-0 z-0">
        {children}
      </div>
      
      {/* Foreground Canvas (The Scratch Layer) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 touch-none cursor-pointer"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      />
    </div>
  );
}
