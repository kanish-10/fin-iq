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
    .replace(/\*\*/g, "")
    .replace(
      "'I cannot provide investment advice, especially not specific startup names. It's important to understand that:\\n\\n* **I am an AI, not a financial advisor.** I have no knowledge of your personal financial situation, risk tolerance, or investment goals.\\n* **Investing in startups is risky.** There's a high chance of losing your entire investment.\\n* **There are countless startups out there.** Recommending specific ones without context would be irresponsible.\\n\\n**Instead of giving you specific names, I can help you think about how to find startups to invest in:**\\n\\n'",
      "",
    )
    .replace(
      "I cannot provide investment advice.  Investing is a complex and risky endeavor that requires careful consideration of your personal financial situation, risk tolerance, and research into specific companies.\\n\\nHowever, I can help you understand the types of startups that might be interesting to consider:\\n",
      "",
    );
}
