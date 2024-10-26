"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatResponse } from "@/lib/utils";
import { File, Send, User } from "lucide-react"; // Import File icon
import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", content: "Hello! How can I assist you today?" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = React.useRef(null); // Ref for file input

  const handleSend = async () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        role: "user",
        content: inputValue,
      };
      setMessages((prev) => [...prev, newMessage]);
      setIsLoading(true);

      try {
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

  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error uploading and analyzing document");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, role: "assistant", content: data.message },
      ]);
    } catch (error) {
      console.error("Error in document analysis:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          role: "assistant",
          content: "Error analyzing the document.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen w-full bg-black text-gray-800">
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
            <Link
              href="/"
              className="text-2xl font-bold text-primary text-white"
            >
              FinIQ
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex space-x-4">
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
              <div className="">
                <UserButton />
              </div>
            </div>
          </div>
        </div>

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
                dangerouslySetInnerHTML={{ __html: message.content }}
              />
              {message.role === "user" && (
                <div className="ml-2 flex size-8 items-center justify-center rounded-full bg-blue-500 text-white">
                  <User className="size-5" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex px-96">
              <div className="mr-2 flex size-8 items-center justify-center rounded-full bg-green-500 px-2 text-white">
                AI
              </div>
              <div className="mb-4 flex max-w-2xl justify-start">
                <div className="rounded-lg bg-gray-100 p-3">Typing...</div>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Input and File Upload Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="relative mx-auto flex max-w-3xl gap-2">
            <Input
              className="w-full rounded-lg border border-gray-300 py-3 pr-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder="Send a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button
              onClick={handleSend}
              className="absolute right-10 top-1/2 mr-2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              variant="ghost"
              size="icon"
            >
              <Send className="size-4" />
            </Button>

            {/* Hidden File Input */}
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              ref={fileInputRef}
              style={{ display: "none" }} // Hide the file input
            />

            {/* File Upload Button as Icon */}
            <Button
              // @ts-ignore
              onClick={() => fileInputRef.current.click()} // Trigger file input click
              className="text-gray-400 hover:text-gray-600"
              variant="ghost"
              size="icon"
            >
              <File className="size-4" /> {/* File Icon */}
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-gray-500">
            Remember humans also make mistakes, and this is still a robot.
          </p>
        </div>
      </div>
    </div>
  );
}
