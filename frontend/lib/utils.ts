import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatResponse(responseText: string): string {
  // Replace common placeholders with HTML elements for readability
  // @ts-ignore
  return responseText.message
    ?.toString()
    .replace(/\n/g, "<br>") // Replace newlines with HTML line breaks
    .replace(/\* "(.*?)"/g, "<li>$1</li>") // Format bullet points as list items
    .replace(
      "For example, you could say:",
      "<strong>For example, you could say:</strong>",
    )
    .replace(
      "I can give you the current conditions",
      "<strong>I can give you the current conditions</strong>",
    )
    .replace(/\*\*/g, "");
}
