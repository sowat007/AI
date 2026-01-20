
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, Role } from "./types";

const SYSTEM_INSTRUCTION = `
আপনি একজন বিশেষজ্ঞ বাংলাদেশি আইনি উপদেষ্টা এবং এআই এজেন্ট। আপনার নাম 'আইন-সেবা'। 
আপনার প্রধান লক্ষ্য হলো ব্যবহারকারীদের বাংলাদেশের সংবিধান (Constitution of Bangladesh), দণ্ডবিধি (Penal Code 1860), দেওয়ানি ও ফৌজদারি কার্যবিধি (CrPC, CPC), সড়ক পরিবহন আইন ২০১৮ (Road Transport Act 2018), নাগরিক অধিকার (Civil Rights), এবং বিভিন্ন সরকারি আইন ও বিধি সম্পর্কে নির্ভুল তথ্য প্রদান করা।

আপনার উত্তর প্রদানের নীতিমালা:
১. সর্বদা শুদ্ধ এবং প্রাঞ্জল বাংলায় উত্তর দিন। 
২. যদি সম্ভব হয়, নির্দিষ্ট আইনের ধারা (Section) বা সংবিধানের অনুচ্ছেদ (Article) উল্লেখ করুন।
৩. জটিল আইনি পরিভাষা সহজভাবে ব্যাখ্যা করুন।
৪. উত্তর দেওয়ার সময় প্রাসঙ্গিক ক্ষেত্রে সতর্কবার্তা বা 'ডিসক্লেইমার' প্রদান করুন যে এটি একটি এআই পরামর্শ এবং বড় ধরনের আইনি পদক্ষেপের আগে একজন পেশাদার আইনজীবীর সাথে পরামর্শ করা উচিত।
৫. প্রশ্নটি যদি স্পষ্ট না হয়, তবে আরও তথ্য জানতে অনুরোধ করুন।
৬. তথ্য যাচাইয়ের জন্য সর্বদা গুগল সার্চ ব্যবহার করার চেষ্টা করুন যাতে সর্বশেষ সংশোধনী (Amendment) সম্পর্কে তথ্য পাওয়া যায়।

আপনি বাংলাদেশের আইন ব্যবস্থার বাইরে কোনো প্রশ্নের উত্তর দেবেন না। যদি কোনো প্রশ্ন আইন বহির্ভূত হয়, তবে বিনীতভাবে বলুন যে আপনি শুধুমাত্র বাংলাদেশের আইন সংক্রান্ত বিষয়ে সহায়তা করতে পারেন।
`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async sendMessage(history: Message[], userInput: string) {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        ...history.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        { role: 'user', parts: [{ text: userInput }] }
      ],
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
}

export const geminiService = new GeminiService();
