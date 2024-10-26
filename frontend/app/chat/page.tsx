"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatResponse } from "@/lib/utils";
import { Send, User } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function ChatPage() {
  const [messages, setMessages] = React.useState([
    { id: 1, role: "assistant", content: "Hello! How can I assist you today?" },
  ]);
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSend = async () => {
    if (inputValue.trim()) {
      console.log("Input Value:", inputValue); // Log input value before API call

      const newMessage = {
        id: messages.length + 1,
        role: "user",
        content: inputValue,
      };
      setMessages((prev) => [...prev, newMessage]);
      setIsLoading(true);

      try {
        // Make sure to send the prompt as a JSON object
        const response = await fetch("/api/llamaai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: inputValue }),
        });

        if (!response.ok) {
          throw new Error("Error fetching response");
        }

        let data = await response.json();
        data = formatResponse(data);
        console.log({ data });
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, role: "assistant", content: data },
        ]);
        setInputValue("");
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            role: "assistant",
            content: "Sorry, there was an error processing your request.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-black text-gray-800">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <nav className="flex w-full flex-row items-end justify-evenly bg-white py-5">
          <div className="flex items-center justify-evenly">
            <p className="text-xl">FinIQ</p>
            <UserButton />
          </div>
        </nav>
        {/* Chat Area */}
        <ScrollArea className="flex-1 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start mb-4 max-w-2xl mx-auto",
                message.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {message.role === "assistant" && (
                <div className="mr-2 flex size-8 items-center justify-center rounded-full bg-green-500 px-2 text-white">
                  AI
                </div>
              )}
              <div
                className={cn(
                  "rounded-lg p-3",
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100",
                )}
                dangerouslySetInnerHTML={{ __html: message.content }} // Render HTML content
              />
              {message.role === "user" && (
                <div className="ml-2 flex size-8 items-center justify-center rounded-full bg-blue-500 text-white">
                  <User className="size-5" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex">
              <div className="mr-2 flex size-8 items-center justify-center rounded-full bg-green-500 px-2 text-white">
                AI
              </div>
              <div className="mb-4 flex max-w-2xl justify-start">
                <div className="rounded-lg bg-gray-100 p-3">Typing...</div>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="relative mx-auto max-w-3xl">
            <Input
              className="w-full rounded-lg border border-gray-300 py-3 pr-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder="Send a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button
              onClick={handleSend}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              variant="ghost"
              size="icon"
            >
              <Send className="size-4" />
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-gray-500">
            Remember humans also make mistake and this is still a robot
          </p>
        </div>
      </div>
    </div>
  );
}
