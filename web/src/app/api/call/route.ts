import { NextResponse } from "next/server";
import { AgentDispatchClient, SipClient } from "livekit-server-sdk";

const LIVEKIT_URL = process.env.LIVEKIT_URL;
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_AGENT_NAME = process.env.LIVEKIT_AGENT_NAME || "Voice-Agent-Final";

const SIP_TRUNK_IN = process.env.SIP_OUTBOUND_TRUNK_ID_IN || "ST_BGnxxGYCdiay";
const SIP_TRUNK_GLOBAL = process.env.SIP_OUTBOUND_TRUNK_ID_GLOBAL || "ST_ChjCVACKwo8T";

// In-memory rate limiting map for basic spam protection (per IP / number)
const recentCalls = new Map<string, number>();
const COOLDOWN_MS = 45 * 1000; // 45 seconds cooldown per number/IP

export async function POST(req: Request) {
  try {
    if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
      return NextResponse.json(
        { error: "LiveKit server credentials are not properly configured on the server." },
        { status: 500 }
      );
    }

    const body = await req.json();
    let { phoneNumber } = body;

    if (!phoneNumber || typeof phoneNumber !== "string") {
      return NextResponse.json(
        { error: "Please provide a valid phone number." },
        { status: 400 }
      );
    }

    // Sanitize phone number (strip whitespace, dashes, parentheses)
    phoneNumber = phoneNumber.replace(/[\s\(\)\-\.]/g, "");

    // If no leading +, assume +91 if 10 digits
    if (!phoneNumber.startsWith("+")) {
      if (phoneNumber.length === 10) {
        phoneNumber = `+91${phoneNumber}`;
      } else {
        phoneNumber = `+${phoneNumber}`;
      }
    }

    // Validate E.164 format: + followed by 7 to 15 digits
    const e164Regex = /^\+[1-9]\d{6,14}$/;
    if (!e164Regex.test(phoneNumber)) {
      return NextResponse.json(
        { error: "Invalid phone number format. Please enter a valid mobile number with country code (e.g. +91 9876543210)." },
        { status: 400 }
      );
    }

    // Rate limiting check
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateLimitKey = `${ip}_${phoneNumber}`;
    const lastCallTime = recentCalls.get(rateLimitKey);
    const now = Date.now();

    if (lastCallTime && now - lastCallTime < COOLDOWN_MS) {
      const waitSec = Math.ceil((COOLDOWN_MS - (now - lastCallTime)) / 1000);
      return NextResponse.json(
        { error: `Please wait ${waitSec}s before placing another call to protect against accidental duplicate calls.` },
        { status: 429 }
      );
    }

    recentCalls.set(rateLimitKey, now);

    // Pick trunk based on country code
    const isIndia = phoneNumber.startsWith("+91");
    const trunkId = isIndia ? SIP_TRUNK_IN : SIP_TRUNK_GLOBAL;

    // Generate unique room name
    const uniqueId = Math.random().toString(36).substring(2, 7);
    const roomName = `call-${Date.now()}-${uniqueId}`;

    // 1. Dispatch the AI Agent to the room first
    const dispatchClient = new AgentDispatchClient(
      LIVEKIT_URL,
      LIVEKIT_API_KEY,
      LIVEKIT_API_SECRET
    );

    await dispatchClient.createDispatch(roomName, LIVEKIT_AGENT_NAME, {
      metadata: JSON.stringify({
        source: "web-direct-dial",
        targetPhone: phoneNumber,
        trunkUsed: trunkId,
        dispatchedAt: new Date().toISOString(),
      }),
    });

    // 2. Instruct LiveKit SIP to dial the number into the same room
    const sipClient = new SipClient(
      LIVEKIT_URL,
      LIVEKIT_API_KEY,
      LIVEKIT_API_SECRET
    );

    const participantIdentity = `sip_${phoneNumber.replace(/\+/g, "")}`;

    const participant = await sipClient.createSipParticipant(
      trunkId,
      phoneNumber,
      roomName,
      {
        participantIdentity,
        participantName: `Caller (${phoneNumber})`,
        playDialtone: true,
      }
    );

    return NextResponse.json({
      success: true,
      roomName,
      phoneNumber,
      trunkId,
      sipParticipantId: participant.participantId,
      message: "Call initiated! Your phone will ring within a few seconds.",
    });
  } catch (error: any) {
    console.error("Error in /api/call:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to initiate call. Please verify the phone number and try again.",
      },
      { status: 500 }
    );
  }
}
