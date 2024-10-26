// app/api/generativeai/route.js
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: any) {
  try {
    const { prompt } = await request.json();

    // Verify if the prompt was received
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    // Load API key from environment variable
    const apiKey = "AIzaSyCX3F9qzSdw5DtPXXywrbjuTs3D5Vwr2Vw";
    if (!apiKey) {
      console.error("Google API key not found");
      return NextResponse.json({ error: "API key not found" }, { status: 500 });
    }

    // Initialize Google Generative AI with the API key
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    console.log({ result: result.response.text() });
    return NextResponse.json({ message: result.response.text() });
  } catch (error) {
    console.error("Google Generative AI request failed:", error);
    return NextResponse.json(
      { error: "Error processing request with Google Generative AI" },
      { status: 500 },
    );
  }
}
