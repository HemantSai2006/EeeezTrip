const OpenAI = require("openai").default;

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

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

    if (!messages || !Array.isArray(messages)) {

      return res.status(400).json({
        success: false,
        message: "Messages array required",
      });
    }

    const formattedMessages = [

      {
        role: "system",
        content: SYSTEM_PROMPT,
      },

      ...messages.map((m) => ({
        role: m.role === "ai"
          ? "assistant"
          : "user",

        content: m.content || "",
      })),
    ];

    const completion =
      await client.chat.completions.create({


        model:
          "openai/gpt-oss-120b:free",

        messages: formattedMessages,

      });

    const reply =
      completion.choices[0].message.content;

    return res.status(200).json({
      success: true,
      reply,
    });

  } catch (error) {

    console.error(
      "OpenRouter Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "AI service temporarily unavailable",
    });
  }
};