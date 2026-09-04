import React from "react";
import { Zap, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#050811] py-8 text-xs text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0c2340] text-[#3395ff]">
            <Zap className="h-3.5 w-3.5" />
          </div>
          <span className="font-bold text-slate-200">Elevate Voice AI</span>
          <span className="text-slate-500">•</span>
          <span>Deployable to Vercel</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://docs.livekit.io"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#3395ff] transition"
          >
            LiveKit Docs
          </a>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#3395ff] transition"
          >
            Vercel Deployment
          </a>
          <a
            href="https://cloud.livekit.io"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#3395ff] transition"
          >
            LiveKit Cloud
          </a>
        </div>

        <p className="text-slate-500">
          Crafted with Razorpay dark mode aesthetic
        </p>
      </div>
    </footer>
  );
}
