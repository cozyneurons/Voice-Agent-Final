import { NextResponse } from "next/server";
import { AccessToken, AgentDispatchClient } from "livekit-server-sdk";

const LIVEKIT_URL = process.env.LIVEKIT_URL;
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_AGENT_NAME = process.env.LIVEKIT_AGENT_NAME || "Voice-Agent-Final";

export async function POST(req: Request) {
  try {
    if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
      return NextResponse.json(
        { error: "LiveKit server credentials are not configured on the server." },
        { status: 500 }
      );
    }

    const uniqueId = Math.random().toString(36).substring(2, 7);
    const roomName = `web-call-${Date.now()}-${uniqueId}`;
    const participantIdentity = `user_${uniqueId}`;

    // 1. Dispatch agent to the room
    const dispatchClient = new AgentDispatchClient(
      LIVEKIT_URL,
      LIVEKIT_API_KEY,
      LIVEKIT_API_SECRET
    );

    await dispatchClient.createDispatch(roomName, LIVEKIT_AGENT_NAME, {
      metadata: JSON.stringify({
        source: "web-browser-call",
        participantIdentity,
        connectedAt: new Date().toISOString(),
      }),
    });

    // 2. Create access token for the browser user
    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: participantIdentity,
      name: `Web Visitor`,
    });

    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    return NextResponse.json({
      token,
      roomName,
      serverUrl: LIVEKIT_URL,
    });
  } catch (error: any) {
    console.error("Error in /api/token:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate room token" },
      { status: 500 }
    );
  }
}
