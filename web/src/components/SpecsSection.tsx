import React from "react";
import { Zap, Globe2, ShoppingCart, Server, ArrowUpRight, Cpu } from "lucide-react";

export default function SpecsSection() {
  const specs = [
    {
      icon: Zap,
      title: "Sub-Second Latency",
      badge: "~458ms End of Turn",
      description:
        "Equipped with the LiveKit Turn Detector to analyze acoustic pitch, rhythm, and semantic cues simultaneously for natural human interruptions.",
      accent: "from-[#0066ff] to-[#3395ff]",
    },
    {
      icon: Globe2,
      title: "Trilingual Conversational Fluency",
      badge: "English • Hindi • Telugu",
      description:
        "Powered by Sarvam AI Saaras STT and Cartesia Sonic TTS. Automatically detects and mirrors the customer's language in real time.",
      accent: "from-[#0c2340] to-[#0066ff]",
    },
    {
      icon: ShoppingCart,
      title: "Sales Qualifying Engine",
      badge: "E-Commerce Pipeline",
      description:
        "Conversationally discovers customer budget, product catalog size, timeline, and feature requirements without feeling like a scripted checklist.",
      accent: "from-[#00d09c]/30 to-[#00d09c]",
    },
    {
      icon: Server,
      title: "Dual SIP Outbound Trunking",
      badge: "India + Global Routing",
      description:
        "Integrated with Vobiz (+91 Indian numbers) and Plivo (North American & Global numbers) with automatic country-code dispatch.",
      accent: "from-[#1e293b] to-[#334155]",
    },
  ];

  return (
    <section className="relative w-full py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Enterprise Voice AI Architecture
          </h2>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl mx-auto">
            Engineered for high-concurrency sales qualification with zero-lag turn taking and instant telephony handshakes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {specs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl border border-slate-800 bg-[#0a101d] p-5 transition-all duration-300 hover:border-[#3395ff]/40 hover:bg-[#0d1527] hover:-translate-y-1 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0c2340] text-[#3395ff] group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-slate-900 border border-slate-700/60 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                    {item.badge}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-bold text-white group-hover:text-[#3395ff] transition-colors">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Live Architecture Footprint Bar */}
        <div className="mt-10 rounded-xl border border-slate-800 bg-[#080d1a] p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3395ff]/10 text-[#3395ff]">
                <Cpu className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Live Pipeline Stack</p>
                <p className="text-[11px] text-slate-400">
                  OpenAI GPT-4o-mini • Sarvam Saaras v3 STT • Cartesia Sonic TTS • LiveKit Cloud
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span className="rounded bg-slate-900 px-2 py-1 border border-slate-800">
                Agent ID: <span className="text-[#3395ff]">CA_DPZ4iSEzBJec</span>
              </span>
              <span className="rounded bg-slate-900 px-2 py-1 border border-slate-800">
                Region: <span className="text-[#00d09c]">ap-south</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
