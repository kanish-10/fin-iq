import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-black text-white">
      <h1 className="text-shadow mb-6 text-center text-4xl font-bold">FinIQ</h1>
      <p className="mb-8 max-w-md text-center text-xl text-green-100">
        One stop platform for market analysis for angel investors
      </p>
      <div className="flex space-x-4">
        <Link href="/chat">
          <Button
            size="lg"
            className="bg-green-500 px-8 py-6 text-lg font-semibold text-black hover:bg-green-600"
          >
            Chat
          </Button>
        </Link>

        <Link href="/quiz">
          <Button
            size="lg"
            className="bg-green-500 px-8 py-6 text-lg font-semibold text-black hover:bg-green-600"
          >
            Quiz
          </Button>
        </Link>
      </div>
    </div>
  );
}
