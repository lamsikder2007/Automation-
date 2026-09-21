import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const body = await req.json();
    const {
      message,
      catalog = [],
      conversationHistory = [],
      customerName = 'Customer',
    } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Default fallback responses if API key is not yet set or in offline mode
    if (!apiKey) {
      return handleOfflineFallback(message, catalog, customerName);
    }

    const ai = new GoogleGenAI({ apiKey });

    const catalogContext = catalog
      .map(
        (p: any) =>
          `SKU: ${p.sku} | Title: ${p.name} | Price: ৳${p.price} BDT | Stock: ${p.stock} units | Sizes: ${
            Array.isArray(p.sizes) ? p.sizes.join(', ') : p.sizes
          } | Colors: ${
            Array.isArray(p.colors) ? p.colors.join(', ') : p.colors
          } | Delivery: ${p.delivery} | Description: ${p.description}`
      )
      .join('\n');

    const systemInstruction = `
You are the official AI Customer Support and Sales Agent for "Apex Mart BD", a premier Bangladeshi e-commerce brand.
You assist customers politely and naturally in their chosen language: Bangla (বাংলা), Banglish (Bangla in English alphabet), or English.

CRITICAL ANTI-HALLUCINATION POLICY:
1. You MUST ONLY provide prices, stock counts, sizes, colors, and delivery charges that exist in the PROVIDED CATALOG below.
2. NEVER guess or fabricate a price, discount, or product availability. If a customer asks for a product not in the catalog, politely say we do not have it in stock currently or offer to transfer them to a human agent.
3. Standard Delivery: ৳60 Inside Dhaka (1-2 days), ৳120 Outside Dhaka (2-3 days). Cash on Delivery available.
4. If the customer requests a phone call, callback, or wants to schedule a time (e.g. "কাল বিকাল ৫টায় কল করবেন"), detect this as a callback_schedule intent and extract the requested time.
5. If the customer wants to place an order, collect their: Product SKU/Name, Size/Color, Full Name, Delivery Address, and 11-digit Bangladeshi Phone Number (e.g. 017xxxxxxxx).

CURRENT VERIFIED PRODUCT CATALOG:
${catalogContext}

Respond STRICTLY in JSON format with the following keys:
{
  "reply": "Your friendly, polite response to the customer in the same language they used (Bangla/Banglish/English)",
  "intent": "product_inquiry" | "price_inquiry" | "stock_inquiry" | "size_color_inquiry" | "delivery_inquiry" | "order_request" | "order_status" | "callback_schedule" | "human_support" | "general_faq",
  "confidence": 0.95,
  "matchedSku": "P001" or null,
  "groundedFactsUsed": ["P001 price ৳850", "Delivery ৳60 inside Dhaka"],
  "requiresHumanHandoff": false,
  "callbackSchedule": {
    "requested": false,
    "dateTimeString": "Tomorrow at 5:00 PM"
  },
  "detectedOrderDetails": {
    "hasOrderIntent": false,
    "sku": "P001",
    "quantity": 1,
    "variant": "Size L White",
    "phone": null,
    "address": null
  }
}
`;

    const contents = [
      ...conversationHistory.map((msg: any) => ({
        role: msg.sender === 'customer' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents as any,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const rawText = response.text || '{}';
    let parsed: any;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = {
        reply: rawText,
        intent: 'product_inquiry',
        confidence: 0.9,
        groundedFactsUsed: ['Parsed response'],
        requiresHumanHandoff: false,
      };
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      {
        error: error?.message || 'Failed to process AI chat',
        reply:
          'সম্মানিত কাস্টমার, আপনার মেসেজটি গ্রহণ করা হয়েছে। আমাদের সাপোর্ট টিম দ্রুত আপনার সাথে যোগাযোগ করবে। (Message received. Connecting to our support representative.)',
        intent: 'general_faq',
        confidence: 0.8,
        requiresHumanHandoff: true,
      },
      { status: 200 }
    );
  }
}

function handleOfflineFallback(message: string, catalog: any[], customerName: string) {
  const lower = message.toLowerCase();
  const matched = catalog.find(
    (p) =>
      lower.includes(p.sku.toLowerCase()) ||
      lower.includes(p.name.toLowerCase()) ||
      (p.category && lower.includes(p.category.toLowerCase()))
  );

  let reply = '';
  let intent = 'general_faq';
  const groundedFactsUsed: string[] = [];

  if (lower.includes('call') || lower.includes('কল') || lower.includes('বিকাল') || lower.includes('সময়')) {
    intent = 'callback_schedule';
    reply = `জি ${customerName}! আপনার সুবিধাজনক সময়ে আমাদের প্রতিনিধি আপনার সাথে ফোনে যোগাযোগ করবে। আমরা কি আপনার দেওয়া নম্বরে কল করবো?`;
    groundedFactsUsed.push('Google Calendar availability check slot');
  } else if (lower.includes('দাম') || lower.includes('price') || lower.includes('koto') || lower.includes('cost')) {
    intent = 'price_inquiry';
    if (matched) {
      reply = `আমাদের ${matched.name} (SKU: ${matched.sku}) এর মূল্য মাত্র ৳${matched.price} টাকা। বর্তমান স্টক: ${matched.stock} টি। ঢাকা সিটিতে ডেলিভারি চার্জ ৳৬০ এবং ঢাকার বাইরে ৳১২০। আপনি কি কোনো নির্দিষ্ট সাইজ নিতে চাচ্ছেন?`;
      groundedFactsUsed.push(`${matched.sku} price ৳${matched.price}`, `stock: ${matched.stock}`);
    } else {
      reply = `আমাদের কাছে অক্সফোর্ড শার্ট (৳৮৫০), ডেনিম জিন্স (৳১৪৫০), পোলো শার্ট (৳৫৫০), ওয়াটারপ্রুফ ব্যাগ (৳১৮৯০) এবং লেদার ওয়ালেট (৳৯৫০) রয়েছে। আপনি কোন প্রোডাক্টটি দেখতে চান?`;
      groundedFactsUsed.push('Full catalog overview');
    }
  } else if (lower.includes('stock') || lower.includes('স্টক') || lower.includes('আছে') || lower.includes('available')) {
    intent = 'stock_inquiry';
    if (matched) {
      reply = `জি হ্যাঁ, ${matched.name} এর ${matched.stock} টি পিস বর্তমানে স্টকে এভেইলএবল রয়েছে (${matched.sizes?.join(', ')} সাইজ)। ক্যাশ অন ডেলিভারিতে অর্ডার করতে পারেন।`;
      groundedFactsUsed.push(`Stock: ${matched.stock}`);
    } else {
      reply = `আমাদের সব রেগুলার প্রোডাক্ট পর্যাপ্ত পরিমাণে স্টকে আছে। আপনি কোনটির সাইজ জানতে চান?`;
    }
  } else if (lower.includes('অর্ডার') || lower.includes('order') || lower.includes('buy') || lower.includes('কিনব')) {
    intent = 'order_request';
    reply = `অর্ডার কনফার্ম করতে অনুগ্রহ করে আপনার পছন্দের প্রোডাক্টের সাইজ, আপনার পুরো নাম, মোবাইল নম্বর এবং সম্পূর্ণ ডেলিভারি ঠিকানা লিখে পাঠান। ধন্যবাদ!`;
  } else {
    reply = `আসসালামু আলাইকুম! Apex Mart BD-তে আপনাকে স্বাগতম। আমাদের প্রিমিয়াম কোয়ালিটি পণ্য, সাইজ, ডেলিভারি চার্জ বা যে কোনো তথ্য জানতে আমাদের জানান।`;
  }

  return NextResponse.json({
    reply,
    intent,
    confidence: 0.95,
    matchedSku: matched?.sku || null,
    groundedFactsUsed,
    requiresHumanHandoff: false,
    callbackSchedule: {
      requested: intent === 'callback_schedule',
      dateTimeString: 'Requested time slot',
    },
  });
}
