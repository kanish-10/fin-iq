import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { answers } = await req.json();

    // Format answers into a structured prompt text for the Gemini model
    const answersText = Object.entries(answers)
      .map(([question, answer]) => `${question}: ${answer}`)
      .join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      {
        text: `Analyze the following answers and provide general guidance for investment in startups in 8 lines:\n\n${answersText}`,
      },
    ]);

    // Return the Gemini response
    return NextResponse.json({ message: result.response.text() });
  } catch (error) {
    console.error("Error in Gemini API request:", error);
    return NextResponse.json(
      { error: "Error processing answers" },
      { status: 500 },
    );
  }
}
