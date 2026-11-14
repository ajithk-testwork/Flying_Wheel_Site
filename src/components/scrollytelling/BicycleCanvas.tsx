"use client";

import { useEffect, useRef, type MutableRefObject } from "react";

interface BicycleCanvasProps {
  frames: HTMLImageElement[];
  targetProgressRef: MutableRefObject<number>;
}

export default function BicycleCanvas({
  frames,
  targetProgressRef,
}: BicycleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || frames.length === 0) return;

    const ctx = canvas.getContext("2d", {
      alpha: false,
    });

    if (!ctx) return;

    let rafId = 0;
    let disposed = false;

    let currentProgress = targetProgressRef.current;

    let width = 0;
    let height = 0;
    let dpr = 1;

    // RESIZE CANVAS
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();

      if (!rect.width || !rect.height) return;

      width = rect.width;
      height = rect.height;

      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };

    // FULL WIDTH IMAGE DRAWING
    const drawFrame = (image: HTMLImageElement) => {
      if (!image.complete || !image.naturalWidth) return;

      const imageRatio = image.naturalWidth / image.naturalHeight;
      const canvasRatio = width / height;

      let drawWidth: number;
      let drawHeight: number;

      // COVER: Fill the complete viewport.
      const scale = Math.max(
        width / image.naturalWidth,
        height / image.naturalHeight,
      );

      drawWidth = image.naturalWidth * scale;
      drawHeight = image.naturalHeight * scale;

      // Center image horizontally and vertically.
      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;

      // Clip outside canvas boundaries.
      ctx.save();

      ctx.beginPath();
      ctx.rect(0, 0, width, height);
      ctx.clip();

      ctx.drawImage(image, x, y, drawWidth, drawHeight);

      ctx.restore();
    };

    // ANIMATION RENDER
    const render = () => {
      if (disposed) return;

      const target = Math.max(0, Math.min(1, targetProgressRef.current));

      // Smooth scroll interpolation.
      currentProgress += (target - currentProgress) * 0.18;

      if (Math.abs(target - currentProgress) < 0.0005) {
        currentProgress = target;
      }

      const frameIndex = Math.min(
        frames.length - 1,
        Math.round(currentProgress * (frames.length - 1)),
      );

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Full background.
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      // Draw current frame.
      drawFrame(frames[frameIndex]);

      if (Math.abs(target - currentProgress) >= 0.0005) {
        rafId = requestAnimationFrame(render);
      } else {
        rafId = 0;
      }
    };

    const startRender = () => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      resizeCanvas();
      startRender();
    };

    // INITIALIZE
    resizeCanvas();
    render();

    const observer = new ResizeObserver(handleResize);

    observer.observe(canvas);

    window.addEventListener("bicycle:progress", startRender);
    window.addEventListener("resize", handleResize);

    return () => {
      disposed = true;

      observer.disconnect();

      window.removeEventListener("bicycle:progress", startRender);
      window.removeEventListener("resize", handleResize);

      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [frames, targetProgressRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Flying Wheel 360 degree bicycle animation"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
      }}
    />
  );
}
