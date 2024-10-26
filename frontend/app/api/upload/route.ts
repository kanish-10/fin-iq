import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";

// Set up a temporary directory for uploads
const UPLOAD_DIR = "/tmp/uploads";

// Ensure the upload directory exists
await fs.mkdir(UPLOAD_DIR, { recursive: true });

export async function POST(req: any) {
  try {
    // Convert the request to a buffer
    const buffer = await req.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    // Define the file path and save the file
    const fileName = `${nanoid()}.pdf`; // Assign a unique name to the file
    const filePath = path.join(UPLOAD_DIR, fileName);
    await fs.writeFile(filePath, fileBuffer);

    // Initialize GoogleGenerativeAI and FileManager
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!);

    // Upload the file to GoogleGenerativeAI
    const uploadResponse = await fileManager.uploadFile(filePath, {
      mimeType: "application/pdf",
      displayName: fileName,
    });

    // Use the file URI for document analysis
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      { text: "Can you summarize this document as a bulleted list?" },
    ]);

    // Clean up the file
    await fs.unlink(filePath);

    // Return the response
    return NextResponse.json({ message: result.response.text() });
  } catch (error) {
    console.error("Error in file processing:", error);
    return NextResponse.json(
      { error: "Error processing document analysis" },
      { status: 500 },
    );
  }
}
