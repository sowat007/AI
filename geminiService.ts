
import { GoogleGenAI, Modality } from "@google/genai";
import { Message, Role } from "./types";

const SYSTEM_INSTRUCTION = `
আপনি একজন বিশেষজ্ঞ বাংলাদেশি আইনি উপদেষ্টা এবং এআই এজেন্ট। আপনার নাম 'আইন-সেবা'। 
আপনার প্রধান লক্ষ্য হলো ব্যবহারকারীদের বাংলাদেশের সংবিধান, দণ্ডবিধি, দেওয়ানি ও ফৌজদারি কার্যবিধি, সড়ক পরিবহন আইন ২০১৮, নাগরিক অধিকার এবং বিভিন্ন সরকারি আইন ও বিধি সম্পর্কে নির্ভুল তথ্য প্রদান করা।

আপনার উত্তর প্রদানের নীতিমালা:
১. সর্বদা শুদ্ধ এবং প্রাঞ্জল বাংলায় উত্তর দিন। 
২. যদি সম্ভব হয়, নির্দিষ্ট আইনের ধারা (Section) বা সংবিধানের অনুচ্ছেদ (Article) উল্লেখ করুন।
৩. জটিল আইনি পরিভাষা সহজভাবে ব্যাখ্যা করুন।
৪. উত্তর দেওয়ার সময় প্রাসঙ্গিক ক্ষেত্রে সতর্কবার্তা প্রদান করুন যে এটি একটি এআই পরামর্শ এবং বড় ধরনের আইনি পদক্ষেপের আগে একজন পেশাদার আইনজীবীর সাথে পরামর্শ করা উচিত।
৫. তথ্য যাচাইয়ের জন্য সর্বদা গুগল সার্চ ব্যবহার করার চেষ্টা করুন।
`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async sendMessage(history: Message[], userInput: string) {
    // We only send the text parts of the history
    const contents = [
      ...history.map(m => ({
        role: m.role === Role.USER ? 'user' : 'model',
        parts: [{ text: m.text }]
      })),
      { role: 'user', parts: [{ text: userInput }] }
    ];

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: contents as any,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "দুঃখিত, আমি আপনার প্রশ্নের উত্তরটি তৈরি করতে পারছি না। আবার চেষ্টা করুন।";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'উৎস',
      uri: chunk.web?.uri || '#'
    })).filter((s: any) => s.uri !== '#') || [];

    return { text, sources };
  }

  async textToSpeech(text: string): Promise<Uint8Array | null> {
    try {
      // Use the native TTS model
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `নিচের আইনি তথ্যটি বাংলায় পাঠ করুন: ${text.substring(0, 800)}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore is great for Bengali sounding speech
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return this.decodeBase64(base64Audio);
      }
    } catch (error) {
      console.error("TTS Error:", error);
    }
    return null;
  }

  private decodeBase64(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
}

export const geminiService = new GeminiService();
