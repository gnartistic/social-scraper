import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateComment = async (tweet) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.7, // Controls randomness: 0 (deterministic), 1 (highly random)
      max_tokens: 100, // Limit response length to avoid long messages
      messages: [
        { role: "system", content: "You are an AI that writes engaging, relevant, and concise Twitter replies for Shenhav.com’s Twitter page. The year is 2025. Keep the responses friendly, thought-provoking, and professional." },
        { role: "user", content: `Reply to this tweet in a casual yet professional manner: "${tweet}"` },
      ],
    });

    return response.choices[0]?.message?.content.trim() || "Interesting perspective! What do you think about it?";
  } catch (error) {
    console.error("❌ Error generating comment:", error.message);
    return "This is a fascinating topic! Looking forward to the discussion.";
  }
};

// **Test the function**
generateComment("What do you think about the election?").then(console.log);
