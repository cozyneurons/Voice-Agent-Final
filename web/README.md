# Razorpay-Themed Voice AI Web App (Deployable to Vercel)

A Next.js (React) web application featuring a sleek **Razorpay-themed dark mode UI** that allows anyone to test your LiveKit Voice AI Agent (`Voice-Agent-Final`).

Visitors can:
1. **📱 Place a Test Call to Their Mobile Phone**: Outbound SIP call routed through your configured LiveKit SIP trunks (Vobiz India `+91` / Plivo Global `+1`).
2. **🎙️ Talk in Browser**: Direct real-time WebRTC audio connection via browser microphone with sub-second latency.

---

## Quick Start (Local Development)

```bash
cd web
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

### Option 1: Deploy with Vercel CLI (Fastest)

Run the following command from the `web` folder:

```bash
cd web
npx vercel
```

Follow the interactive prompts (Accept defaults). When prompted for production, run:
```bash
npx vercel --prod
```

### Option 2: Deploy via GitHub + Vercel Dashboard

1. Push your repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository.
3. In the **Project Settings**:
   - **Root Directory**: Select `web` (click Edit and select `web`).
   - **Framework Preset**: Next.js (automatically detected).
4. Add the following **Environment Variables** in the Vercel dashboard:
   - `LIVEKIT_URL`: `wss://elevate-xzfpw63b.livekit.cloud`
   - `LIVEKIT_API_KEY`: Your LiveKit API Key (`APId6QwCQABPtAE`)
   - `LIVEKIT_API_SECRET`: Your LiveKit API Secret
   - `SIP_OUTBOUND_TRUNK_ID_IN`: `ST_BGnxxGYCdiay` (Vobiz India Trunk)
   - `SIP_OUTBOUND_TRUNK_ID_GLOBAL`: `ST_ChjCVACKwo8T` (Plivo Trunk)
   - `LIVEKIT_AGENT_NAME`: `Voice-Agent-Final`
5. Click **Deploy**!

Your website will be live with a global CDN and serverless API routes on Vercel.
