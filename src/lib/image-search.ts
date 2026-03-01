import { google } from "googleapis";

const customSearch = google.customsearch("v1");

export async function searchImage(query: string): Promise<string | null> {
  try {
    const res = await customSearch.cse.list({
      auth: process.env.GOOGLE_API_KEY!,
      cx: process.env.GOOGLE_CSE_ID!,
      q: query,
      searchType: "image",
      num: 1,
      safe: "active",
    });

    return res.data.items?.[0]?.link ?? null;
  } catch (error) {
    console.error("Image search failed:", error);
    return null;
  }
}
