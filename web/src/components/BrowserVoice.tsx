"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, PhoneOff, Loader2, Volume2, Sparkles, Radio } from "lucide-react";
import { Room, RoomEvent, Track, RemoteTrack } from "livekit-client";

export default function BrowserVoice() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [agentSpeaking, setAgentSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [statusText, setStatusText] = useState("Ready to connect");
  const [errorMessage, setErrorMessage] = useState("");

  const roomRef = useRef<Room | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
      }
    };
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    setErrorMessage("");
    setStatusText("Requesting room token & dispatching agent...");

    try {
      const res = await fetch("/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate connection token.");
      }

      const { token, serverUrl } = data;
      setStatusText("Connecting to LiveKit WebRTC room...");

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      roomRef.current = room;

      // Handle incoming audio tracks (Agent's voice)
      room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack) => {
        if (track.kind === Track.Kind.Audio) {
          if (!audioElementRef.current) {
            const el = document.createElement("audio");
            el.autoplay = true;
            audioElementRef.current = el;
            document.body.appendChild(el);
          }
          track.attach(audioElementRef.current);
          setStatusText("Agent connected! Say 'Hello' to begin.");
        }
      });

      // Handle active speakers
      room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
        let isAgent = false;
        let isUser = false;
        speakers.forEach((s) => {
          if (s.isLocal) {
            isUser = true;
          } else {
            isAgent = true;
          }
        });
        setAgentSpeaking(isAgent);
        setUserSpeaking(isUser);
      });

      room.on(RoomEvent.Disconnected, () => {
        setIsConnected(false);
        setIsConnecting(false);
        setStatusText("Call disconnected");
      });

      await room.connect(serverUrl, token);
      setStatusText("Enabling microphone...");
      await room.localParticipant.setMicrophoneEnabled(true);

      setIsConnected(true);
      setIsConnecting(false);
      setStatusText("Call live! Speak in English, Hindi, or Telugu.");
    } catch (err: any) {
      console.error("Connection error:", err);
      setIsConnecting(false);
      setIsConnected(false);
      setErrorMessage(
        err.message || "Could not connect to voice session. Please ensure microphone access is permitted."
      );
      setStatusText("Connection failed");
    }
  };

  const handleDisconnect = () => {
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
    }
    if (audioElementRef.current) {
      audioElementRef.current.remove();
      audioElementRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    setAgentSpeaking(false);
    setUserSpeaking(false);
    setStatusText("Ready to connect");
  };

  const toggleMute = async () => {
    if (!roomRef.current) return;
    const newMute = !isMuted;
    await roomRef.current.localParticipant.setMicrophoneEnabled(!newMute);
    setIsMuted(newMute);
  };

  return (
    <div className="relative w-full rounded-2xl border border-[#3395ff]/20 bg-[#0d1527]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-[#3395ff]/60 to-transparent" />

      {/* Header */}
      <div className="mb-6 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#00d09c]/20 bg-[#00d09c]/10 px-3 py-1 text-xs font-semibold text-[#00d09c]">
          <Radio className="h-3.5 w-3.5" />
          <span>ZERO-DIAL IN-BROWSER WEBRTC</span>
        </div>
        <h3 className="mt-2 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
          Talk to the Agent in Browser
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          No phone number required. Connect your laptop or mobile microphone to converse with the agent in real time.
        </p>
      </div>

      {/* Main Interactive Stage */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-[#080d1a] p-8 text-center">
        {/* Animated Orb / Visualizer */}
        <div className="relative flex h-28 w-28 items-center justify-center">
          {isConnected && (
            <div
              className={`absolute inset-0 rounded-full transition-all duration-300 ${
                agentSpeaking
                  ? "bg-[#00d09c]/25 scale-125 animate-pulse"
                  : userSpeaking
                  ? "bg-[#3395ff]/25 scale-125 animate-pulse"
                  : "bg-slate-800/30 scale-100"
              }`}
            />
          )}
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300 ${
              isConnected
                ? agentSpeaking
                  ? "bg-[#00d09c] text-slate-950 shadow-lg shadow-[#00d09c]/40"
                  : "bg-[#0c2340] border-2 border-[#3395ff] text-[#3395ff]"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            {isConnecting ? (
              <Loader2 className="h-8 w-8 animate-spin text-[#3395ff]" />
            ) : isConnected ? (
              agentSpeaking ? (
                <Volume2 className="h-9 w-9 animate-bounce" />
              ) : (
                <Mic className="h-8 w-8" />
              )
            ) : (
              <Mic className="h-8 w-8 text-slate-500" />
            )}
          </div>
        </div>

        {/* Live Audio Waves when speaking */}
        {isConnected && (
          <div className="mt-4 flex items-center gap-1.5 h-7">
            <span className={`wave-bar ${agentSpeaking ? "!bg-[#00d09c]" : ""}`} />
            <span className={`wave-bar ${agentSpeaking ? "!bg-[#00d09c]" : ""}`} />
            <span className={`wave-bar ${agentSpeaking ? "!bg-[#00d09c]" : ""}`} />
            <span className={`wave-bar ${agentSpeaking ? "!bg-[#00d09c]" : ""}`} />
            <span className={`wave-bar ${agentSpeaking ? "!bg-[#00d09c]" : ""}`} />
            <span className={`wave-bar ${agentSpeaking ? "!bg-[#00d09c]" : ""}`} />
          </div>
        )}

        {/* Status text */}
        <div className="mt-4">
          <p className="text-sm font-semibold text-white">
            {isConnected
              ? agentSpeaking
                ? "Agent is speaking..."
                : userSpeaking
                ? "Listening to you..."
                : "Connected & ready (Speak freely)"
              : statusText}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            {isConnected
              ? "Under ~450ms turn-taking latency"
              : "Uses Opus codec at 48kHz for high-fidelity audio"}
          </p>
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0066ff] to-[#3395ff] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#0066ff]/25 transition hover:brightness-110 active:scale-95 disabled:opacity-50"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Connecting to Agent...</span>
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  <span>Start Browser Voice Call</span>
                </>
              )}
            </button>
          ) : (
            <>
              <button
                onClick={toggleMute}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition ${
                  isMuted
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                    : "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                <span>{isMuted ? "Unmute Mic" : "Mute Mic"}</span>
              </button>

              <button
                onClick={handleDisconnect}
                className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
              >
                <PhoneOff className="h-4 w-4" />
                <span>Disconnect Call</span>
              </button>
            </>
          )}
        </div>

        {errorMessage && (
          <p className="mt-4 text-xs text-red-400 bg-red-950/40 border border-red-800/50 rounded-lg p-2.5">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
