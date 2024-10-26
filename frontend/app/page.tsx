import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-900 to-black text-white">
      <h1 className="text-shadow mb-6 text-center text-4xl font-bold">
        Welcome to Our Chat App
      </h1>
      <p className="mb-8 max-w-md text-center text-xl text-green-100">
        Experience real-time conversations with our innovative chat platform.
      </p>
      <Link href="/chat">
        <Button
          size="lg"
          className="bg-green-500 px-8 py-6 text-lg font-semibold text-black hover:bg-green-600"
        >
          Start Chatting
        </Button>
      </Link>
    </div>
  );
}
