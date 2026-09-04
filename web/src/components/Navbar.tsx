"use client";

import React from "react";
import { PhoneCall, ShieldCheck, Zap, Radio } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#3395ff]/10 bg-[#050811]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0c2340] via-[#0066ff] to-[#3395ff] shadow-lg shadow-[#3395ff]/20">
            <Zap className="h-5 w-5 text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00d09c] opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#00d09c]"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">
                Elevate<span className="text-[#3395ff]">Voice</span>
              </span>
              <span className="rounded bg-[#0c2340] px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-[#3395ff] border border-[#3395ff]/20">
                PROD
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Conversational AI Sales Assistant</p>
          </div>
        </div>

        {/* Live Status Pill & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#00d09c]/25 bg-[#00d09c]/10 px-3 py-1 text-xs font-medium text-[#00d09c]">
            <span className="h-2 w-2 rounded-full bg-[#00d09c] animate-pulse"></span>
            <span>Live on ap-south (Mumbai)</span>
          </div>

          <a
            href="https://cloud.livekit.io"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-[#3395ff] hover:text-[#3395ff]"
          >
            <Radio className="h-3.5 w-3.5 text-[#3395ff]" />
            <span className="hidden sm:inline">LiveKit Cloud</span>
          </a>
        </div>
      </div>
    </header>
  );
}
