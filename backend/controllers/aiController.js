const { GoogleGenerativeAI } = require("@google/generative-ai");

const SYSTEM_PROMPT = `
You are Eeeztrip's expert AI travel assistant for India.

When users ask about trips, ALWAYS provide:
- Specific price estimates in Indian Rupees (₹)
- Transport options
- Hotel recommendations
- Top attractions
- Food spots
- Best season to visit

Be practical, enthusiastic and concise.
`;

exports.chat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Messages array required",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is not configured.",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Format messages for Gemini: { role: 'user' | 'model', parts: [{ text: ... }] }
    const contents = [];
    for (const m of messages) {
      const role = (m.role === "ai" || m.role === "assistant") ? "model" : "user";
      const text = typeof m.content === "string" ? m.content : JSON.stringify(m.content || "");

      // If consecutive messages have the same role, append text part to avoid API error
      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts.push({ text });
      } else {
        contents.push({
          role,
          parts: [{ text }],
        });
      }
    }

    // Ensure the first message is from 'user'
    if (contents.length > 0 && contents[0].role !== "user") {
      contents.unshift({ role: "user", parts: [{ text: "Hello" }] });
    }

    const result = await model.generateContent({ contents });
    const reply = result.response.text();

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Gemini AI Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "AI service temporarily unavailable",
    });
  }
};