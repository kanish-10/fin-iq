"use client";

import React, { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function ChatPage() {
  // Array of questions for the quiz
  const questions = [
    "Can you tell us about your investment experience, including how long you've been investing and the types of investments you focus on (e.g., early-stage startups, real estate, public markets)?",
    "Could you share some examples of past investments? What attracted you to those opportunities?",
    "What industries or sectors do you typically invest in, and are there any specific industries you have a preference for?",
    "What professional experiences or roles outside of investing have contributed to your approach to investment?",
    "What investment strategies have you found most successful, and are there any that you currently prioritize?",
    "How involved do you like to be with the companies or projects you invest in (e.g., hands-on advisory, board positions, or passive investment)?",
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question
  const [answer, setAnswer] = useState(""); // Store the current answer
  const [answers, setAnswers] = useState({}); // Store all answers as an object
  const [summary, setSummary] = useState(""); // Store the summary or guidance from the API

  const handleSubmit = () => {
    const currentQuestion = questions[currentQuestionIndex];

    // Use the callback function in `setAnswers` to update based on previous state
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestion]: answer.trim() || "N/A",
    }));

    // Move to the next question or submit answers to API if done
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswer(""); // Reset the answer field
    } else {
      // If it's the last question, call the function to send data to Gemini API
      sendToGeminiAPI({
        ...answers,
        [currentQuestion]: answer.trim() || "N/A",
      });
    }
  };

  const sendToGeminiAPI = async (finalAnswers: any) => {
    try {
      const response = await fetch("/api/quizanalyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });

      if (!response.ok) {
        throw new Error("Error fetching guidance from API");
      }

      const data = await response.json();
      const cleanedMessage = data.message.toString().replace(/\*\*/g, ""); // Remove all `**` symbols
      setSummary(cleanedMessage);
    } catch (error) {
      console.error("Error sending data to Gemini API:", error);
    }
  };

  return (
    <div className="flex h-screen bg-black text-gray-800">
      <div className="flex flex-1 flex-col">
        <div className="flex h-16 items-center justify-between px-52">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="logo"
              height={30}
              width={30}
              className="mr-2"
            />
            <Link href="/" className="text-2xl font-bold text-white">
              FinIQ
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/chat"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-primary"
              >
                Chat with bot
              </Link>
              <Link
                href="/quiz"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-primary"
              >
                Analyze yourself
              </Link>
              <UserButton />
            </div>
          </div>
        </div>

        {/* Quiz Section */}
        <div className="flex flex-1 flex-col items-center justify-center px-64">
          {summary ? (
            <div className="max-w-2xl text-center">
              <p className="text-lg text-white">{summary}</p>
            </div>
          ) : (
            <>
              <h1 className="mb-4 text-2xl font-semibold text-white">
                {questions[currentQuestionIndex]}
              </h1>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="mb-4 w-full max-w-md rounded-lg border border-gray-300 px-4 py-3 text-black focus:border-transparent focus:ring-2 focus:ring-green-500"
                placeholder="Type your answer here"
              />
              <button
                onClick={handleSubmit}
                className="rounded-lg bg-green-500 px-8 py-3 text-lg font-semibold text-black hover:bg-green-600"
              >
                Submit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
