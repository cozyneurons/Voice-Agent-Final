"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import PhoneDialer from "@/components/PhoneDialer";
import BrowserVoice from "@/components/BrowserVoice";
import ScrollSequence from "@/components/ScrollSequence";

export default function Home() {
  return (
    <div className="bg-transparent text-slate-100 min-h-screen">
      <ScrollSequence />

      {/* Spacer to allow scrolling through the animation */}
      <div className="h-[300vh]"></div>

      {/* The bottom section where the phone is intact, and widgets appear */}
      <div className="relative z-10 h-screen flex flex-col justify-center w-full px-4 lg:px-8 pb-20 pointer-events-none">
        
        {/* We use pointer-events-none on the container so the canvas behind can be interacted with if needed,
            but re-enable pointer events on the actual widgets so they can be clicked */}
            
        <div className="flex items-center justify-between w-full h-full max-w-none">
          {/* Left Widget (Phone Dialer) */}
          <div className="w-[320px] xl:w-[350px] flex-shrink-0 pointer-events-auto transform -translate-x-2">
             <PhoneDialer />
          </div>
          
          {/* Empty middle space for the canvas to show through (the intact telephone) */}
          <div className="flex-1"></div>

          {/* Right Widget (Browser Voice) */}
          <div className="w-[320px] xl:w-[350px] flex-shrink-0 pointer-events-auto transform translate-x-2">
             <BrowserVoice />
          </div>
        </div>

      </div>
    </div>
  );
}
