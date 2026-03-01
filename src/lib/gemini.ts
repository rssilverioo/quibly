import { GoogleGenerativeAI } from "@google/generative-ai";

let _gemini: ReturnType<GoogleGenerativeAI["getGenerativeModel"]> | null = null;

export function getGemini() {
  if (!_gemini) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    _gemini = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }
  return _gemini;
}
