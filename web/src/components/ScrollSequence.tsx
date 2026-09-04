"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger, this must be done on the client side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const frameCount = 300;
  const images = useRef<HTMLImageElement[]>([]);
  const currentFrameIndex = useRef(0);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const loadImages = () => {
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        // Construct the image source using 3-digit padding, e.g., 001, 002
        img.src = `/Animate/ezgif-frame-${(i + 1).toString().padStart(3, '0')}.jpg`;
        
        img.onload = () => {
          loadedCount++;
          setProgress(loadedCount / frameCount);
          if (loadedCount === frameCount) {
            setLoaded(true);
          }
        };
        
        // Handle image load error gracefully (skip frame or just count it as loaded to not block)
        img.onerror = () => {
          console.warn(`Failed to load frame ${img.src}`);
          loadedCount++;
          if (loadedCount === frameCount) {
            setLoaded(true);
          }
        };

        images.current.push(img);
      }
    };
    
    // Only load if not already loaded to prevent React strict-mode double-fetch issues
    if (images.current.length === 0) {
      loadImages();
    }
  }, []);

  // GSAP animation & canvas drawing
  useEffect(() => {
    if (!loaded || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false }); // Optimize for no transparency
    if (!ctx) return;

    // Drawing function to scale and center the image (cover)
    const renderFrame = (index: number) => {
      const img = images.current[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      
      // Update canvas size to match layout
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Calculate aspect ratio for 'cover' effect
      const ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;
      const x = (canvas.width - newWidth) / 2;
      const y = (canvas.height - newHeight) / 2;
      
      ctx.drawImage(img, 0, 0, img.width, img.height, x, y, newWidth, newHeight);
    };

    // Initial render
    renderFrame(currentFrameIndex.current);

    // Re-render on window resize to maintain proper scaling
    const handleResize = () => requestAnimationFrame(() => renderFrame(currentFrameIndex.current));
    window.addEventListener("resize", handleResize);

    // Setup GSAP ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom", // Scrub over the entire height of the document
        scrub: 0.1,    // Smoothness (0 = immediate, >0 = smooth lag)
      }
    });
    
    // Proxy object for GSAP to animate
    const proxy = { frame: 0 };
    tl.to(proxy, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none", // Linear animation tied to scroll
      onUpdate: () => {
        currentFrameIndex.current = Math.round(proxy.frame);
        // Use requestAnimationFrame for smoother rendering
        requestAnimationFrame(() => renderFrame(currentFrameIndex.current));
      }
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [loaded]);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-screen bg-transparent overflow-hidden z-0 pointer-events-none">
      {/* Loading Fallback */}
      {!loaded && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-transparent">
          <div className="text-white text-sm font-semibold tracking-widest uppercase mb-4 opacity-70">
            Loading Experience...
          </div>
          <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#3395ff] to-[#00d09c] transition-all duration-300 ease-out"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block mix-blend-screen" 
        style={{ 
          opacity: loaded ? 1 : 0, 
          transition: "opacity 1s ease-in-out" 
        }}
      />
      
      {/* Optional: Add gradient overlays if needed for blending into the rest of the site */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050811] to-transparent pointer-events-none z-10" />
    </div>
  );
}
