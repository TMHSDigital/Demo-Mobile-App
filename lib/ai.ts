import * as FileSystem from "expo-file-system/legacy";

const API_KEY = process.env.EXPO_PUBLIC_OPENAI_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

export function isAIEnabled(): boolean {
  return Boolean(API_KEY);
}

export async function describePhoto(
  photoUri: string
): Promise<string | null> {
  if (!API_KEY) return null;

  try {
    const base64 = await FileSystem.readAsStringAsync(photoUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Describe this photo in 2-3 sentences for a personal journal. Be warm and specific about what you see, as if writing a diary entry. Don't start with 'This photo shows' or similar.",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64}`,
                  detail: "low",
                },
              },
            ],
          },
        ],
        max_tokens: 150,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}
