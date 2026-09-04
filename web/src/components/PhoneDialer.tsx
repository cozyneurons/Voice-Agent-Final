"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  PhoneCall,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  Sparkles,
  RefreshCw,
  PhoneOff,
} from "lucide-react";
import confetti from "canvas-confetti";

interface Country {
  name: string;
  code: string;
  flag: string;
  placeholder: string;
}

const COUNTRIES: Country[] = [
  { name: "India", code: "+91", flag: "🇮🇳", placeholder: "98765 43210" },
  { name: "United States", code: "+1", flag: "🇺🇸", placeholder: "202 555 0125" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧", placeholder: "7911 123456" },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪", placeholder: "50 123 4567" },
  { name: "Singapore", code: "+65", flag: "🇸🇬", placeholder: "8123 4567" },
  { name: "Canada", code: "+1", flag: "🇨🇦", placeholder: "416 555 0192" },
  { name: "Australia", code: "+61", flag: "🇦🇺", placeholder: "412 345 678" },
];

export default function PhoneDialer() {
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [phoneDigits, setPhoneDigits] = useState("");
  const [status, setStatus] = useState<"idle" | "calling" | "active" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [callData, setCallData] = useState<{
    roomName?: string;
    phoneNumber?: string;
    trunkId?: string;
    sipParticipantId?: string;
  } | null>(null);

  const [callDuration, setCallDuration] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  // Timer for active call simulation
  useEffect(() => {
    let interval: any;
    if (status === "active") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  // Cooldown countdown
  useEffect(() => {
    let interval: any;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlaceCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;

    setErrorMessage("");

    // Strip spaces, dashes, parentheses
    const rawNumber = phoneDigits.replace(/[\s\-\(\)\.]/g, "");
    if (!rawNumber || rawNumber.length < 7) {
      setErrorMessage("Please enter a valid mobile number.");
      return;
    }

    // Compose full E.164 phone number
    const fullNumber = rawNumber.startsWith("+")
      ? rawNumber
      : `${selectedCountry.code}${rawNumber}`;

    setStatus("calling");

    try {
      const res = await fetch("/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: fullNumber }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate outbound call.");
      }

      setCallData({
        roomName: data.roomName,
        phoneNumber: fullNumber,
        trunkId: data.trunkId,
        sipParticipantId: data.sipParticipantId,
      });

      setStatus("active");
      setCooldown(45); // 45s cooldown protection

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#3395ff", "#00d09c", "#ffffff"],
        });
      } catch (err) {
        // Ignore canvas error if any
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred.");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setErrorMessage("");
    setCallData(null);
  };

  return (
    <div className="relative w-full rounded-2xl border border-[#3395ff]/20 bg-[#0d1527]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      {/* Decorative top accent glow */}
      <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-[#3395ff]/60 to-transparent" />

      {/* Header inside Card */}
      <div className="mb-6 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#3395ff]/20 bg-[#3395ff]/10 px-3 py-1 text-xs font-semibold text-[#3395ff]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>REAL-TIME TELEPHONY DISPATCH</span>
        </div>
        <h3 className="mt-2 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
          Get a Phone Call from the AI
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          Enter your phone number. Our deployed AI agent will call your phone and pitch our e-commerce services in your preferred language.
        </p>
      </div>

      {status === "active" ? (
        /* Active Call State */
        <div className="rounded-xl border border-[#00d09c]/30 bg-[#00d09c]/5 p-5 sm:p-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#00d09c]/20 ring-8 ring-[#00d09c]/10 animate-pulse">
            <PhoneCall className="h-8 w-8 text-[#00d09c]" />
          </div>

          <div className="mt-4">
            <span className="inline-block rounded-full bg-[#00d09c]/20 px-3 py-1 text-xs font-bold tracking-wide text-[#00d09c]">
              OUTBOUND CALL PLACED
            </span>
            <h4 className="mt-2 text-lg font-bold text-white">
              Calling {callData?.phoneNumber}
            </h4>
            <p className="mt-1 text-xs text-slate-300">
              Pick up your phone to talk with the agent. Listen to the natural conversational flow and multilingual answers!
            </p>
          </div>

          {/* Active Call Timeline */}
          <div className="mt-6 space-y-2.5 rounded-lg border border-slate-800 bg-[#080d1a] p-4 text-left text-xs">
            <div className="flex items-center gap-2.5 text-[#00d09c]">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Agent <strong>Voice-Agent-Final</strong> dispatched to room</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#00d09c]">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>
                Routed via SIP Trunk:{" "}
                <code className="rounded bg-slate-900 px-1.5 py-0.5 text-[11px] text-slate-300">
                  {callData?.trunkId || "ST_BGnxxGYCdiay"}
                </code>
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-[#3395ff]">
              <span className="h-2 w-2 rounded-full bg-[#3395ff] animate-ping shrink-0" />
              <span>Ringing carrier network and recipient handset...</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                Elapsed: <strong className="text-white">{formatTimer(callDuration)}</strong>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {callData?.roomName}
              </span>
            </div>
          </div>

          <button
            onClick={handleReset}
            type="button"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Place Another Test Call
          </button>
        </div>
      ) : (
        /* Phone Input Form */
        <form onSubmit={handlePlaceCall} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Your Mobile Number
            </label>
            <div className="relative flex rounded-xl border border-[#3395ff]/30 bg-[#080d1a] shadow-inner transition focus-within:border-[#3395ff] focus-within:ring-2 focus-within:ring-[#3395ff]/20">
              {/* Country Selector Dropdown */}
              <div className="flex items-center gap-1 border-r border-slate-800 px-3 py-2.5">
                <span className="text-lg">{selectedCountry.flag}</span>
                <select
                  aria-label="Select Country Code"
                  value={selectedCountry.code}
                  onChange={(e) => {
                    const found = COUNTRIES.find((c) => c.code === e.target.value);
                    if (found) setSelectedCountry(found);
                  }}
                  className="bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer"
                >
                  {COUNTRIES.map((c, i) => (
                    <option key={`${c.code}-${i}`} value={c.code} className="bg-[#0d1527] text-white">
                      {c.flag} {c.code} ({c.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Number Input */}
              <input
                type="tel"
                placeholder={selectedCountry.placeholder}
                value={phoneDigits}
                onChange={(e) => setPhoneDigits(e.target.value)}
                disabled={status === "calling"}
                className="w-full bg-transparent px-3.5 py-2.5 text-base font-medium text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Helper / Sample Hint */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Direct SIP routing:{" "}
              <strong className="text-slate-300">
                {selectedCountry.code === "+91" ? "Vobiz India Trunk" : "Plivo Global Trunk"}
              </strong>
            </span>
            <button
              type="button"
              onClick={() => setPhoneDigits("")}
              className="text-slate-400 hover:text-[#3395ff] transition"
            >
              Clear
            </button>
          </div>

          {/* Error Display */}
          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Cooldown notice if active */}
          {cooldown > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
              <Clock className="h-3.5 w-3.5" />
              <span>Rate limit active: please wait {cooldown}s before placing another call.</span>
            </div>
          )}

          {/* Submit Button (Razorpay Blue Signature Gradient) */}
          <button
            type="submit"
            disabled={status === "calling" || cooldown > 0}
            className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-[#0066ff] via-[#1a75ff] to-[#3395ff] px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-[#0066ff]/30 transition-all duration-200 hover:shadow-xl hover:shadow-[#0066ff]/45 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Gloss hover effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

            {status === "calling" ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Dispatching Agent & Ringing Trunk...</span>
              </>
            ) : (
              <>
                <Phone className="h-5 w-5" />
                <span>Place Test Call to My Phone</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Security & Spam Prevention Footer */}
      <div className="mt-5 flex items-center justify-center gap-2 text-center text-[11px] text-slate-400 border-t border-slate-800/80 pt-4">
        <Shield className="h-3.5 w-3.5 text-[#00d09c]" />
        <span>100% Free Live Demo • Safe & Rate-Limited • Zero Spam Guarantee</span>
      </div>
    </div>
  );
}
