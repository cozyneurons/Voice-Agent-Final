"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import PhoneDialer from "@/components/PhoneDialer";
import BrowserVoice from "@/components/BrowserVoice";
import SpecsSection from "@/components/SpecsSection";
import Footer from "@/components/Footer";
import { Phone, Mic, Sparkles, CheckCircle, Shield, ArrowRight } from "lucide-react";

export default function About() {
  const [activeTab, setActiveTab] = useState<"phone" | "browser">("phone");

  return (
    <div className="flex min-h-screen flex-col bg-transparent text-slate-100">
      <Navbar />

      <main className="flex-1 relative">
        <div className="relative z-10">
          {/* Hero Section */}
          <section className="relative overflow-hidden pt-12 pb-8 sm:pt-16 sm:pb-12">
            <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[700px] rounded-full bg-[#0066ff]/15 blur-[120px]" />

            <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#3395ff]/30 bg-[#0c2340]/60 px-3.5 py-1 text-xs font-semibold text-[#3395ff] shadow-sm backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                <span>MULTILINGUAL VOICE SALES AGENT • ENGLISH | HINDI | TELUGU</span>
              </div>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Experience the Future of{" "}
                <span className="bg-gradient-to-r from-[#3395ff] via-[#60a5fa] to-[#00d09c] bg-clip-text text-transparent">
                  Voice AI Sales
                </span>
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 sm:text-lg">
                Place a real test call directly to your mobile phone, or talk seamlessly in your browser with sub-second latency.
              </p>

              <div className="mt-8 flex justify-center">
                <div className="inline-flex rounded-xl border border-slate-800 bg-[#0a101d] p-1.5 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setActiveTab("phone")}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-all sm:text-sm ${
                      activeTab === "phone"
                        ? "bg-[#0c2340] text-[#3395ff] border border-[#3395ff]/30 shadow-md shadow-[#3395ff]/10"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call My Phone (SIP Outbound)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("browser")}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-all sm:text-sm ${
                      activeTab === "browser"
                        ? "bg-[#0c2340] text-[#00d09c] border border-[#00d09c]/30 shadow-md shadow-[#00d09c]/10"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Mic className="h-4 w-4" />
                    <span>Talk in Browser (WebRTC)</span>
                  </button>
                </div>
              </div>

              <div className="mx-auto mt-6 w-full max-w-lg">
                {activeTab === "phone" ? <PhoneDialer /> : <BrowserVoice />}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-[#00d09c]" />
                  <span>Zero Installation Required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-[#00d09c]" />
                  <span>Sub-500ms Human-like Response</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-[#00d09c]" />
                  <span>Multi-Trunk Auto Failover</span>
                </div>
              </div>
            </div>
          </section>

          <SpecsSection />
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
