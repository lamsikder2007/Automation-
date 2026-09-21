import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { initialProducts } from '@/lib/mockData';

// Facebook Webhook Verify Token
const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'apex_mart_secret_verify_token_2026';
const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN || '';

/**
 * GET Handler for Facebook Webhook Verification Challenge
 * When you configure webhook in Meta Developer portal, Facebook sends:
 * hub.mode, hub.verify_token, hub.challenge
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === FB_VERIFY_TOKEN) {
    console.log('[FB Webhook Verified] Successfully validated verify_token');
    return new NextResponse(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return NextResponse.json({ error: 'Verification token mismatch or invalid mode' }, { status: 403 });
}

/**
 * POST Handler for Inbound Facebook Messenger Messages & Postbacks
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Verify it's a page subscription
    if (body.object !== 'page') {
      return NextResponse.json({ error: 'Not a page event' }, { status: 404 });
    }

    const entries = body.entry || [];
    let processedCount = 0;

    for (const entry of entries) {
      const messagingEvents = entry.messaging || [];

      for (const event of messagingEvents) {
        const senderPsid = event.sender?.id;
        const message = event.message;

        // Skip echoes or messages sent by the page itself
        if (!senderPsid || !message || message.is_echo) {
          continue;
        }

        const userText = message.text || '';
        processedCount++;

        // Process with Gemini AI if API key is present
        let replyText = 'ধন্যবাদ! আপনার বার্তাটি আমরা পেয়েছি। আমাদের কাস্টমার প্রতিনিধি শীঘ্রই যোগাযোগ করবেন।';

        if (process.env.GEMINI_API_KEY && userText) {
          try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const prompt = `You are the official AI Assistant for Apex Mart BD, an e-commerce store in Bangladesh.
Current Live Catalog from Google Sheets:
${JSON.stringify(initialProducts, null, 2)}

Rules:
1. Ground every answer strictly in the catalog above. Never hallucinate products or prices.
2. Prices are in BDT (৳).
3. Delivery: ৳60 Inside Dhaka, ৳120 Outside Dhaka.
4. Reply in natural, polite Bengali (with English terms when natural).
5. Customer message: "${userText}"

Reply concisely suitable for Facebook Messenger.`;

            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
            });

            if (response.text) {
              replyText = response.text;
            }
          } catch (aiErr) {
            console.error('[Messenger Webhook AI Error]', aiErr);
          }
        }

        // Send message back to Meta Graph API if access token is configured
        if (FB_PAGE_ACCESS_TOKEN) {
          try {
            await fetch(`https://graph.facebook.com/v20.0/me/messages?access_token=${FB_PAGE_ACCESS_TOKEN}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                recipient: { id: senderPsid },
                message: { text: replyText },
              }),
            });
          } catch (sendErr) {
            console.error('[Meta Send API Error]', sendErr);
          }
        }
      }
    }

    // Always respond with 200 OK immediately to acknowledge Meta webhook
    return NextResponse.json({
      success: true,
      processed: processedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Messenger Webhook Error]', err);
    return NextResponse.json({ error: 'Internal webhook error: ' + err.message }, { status: 500 });
  }
}
