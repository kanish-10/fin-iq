import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="dark flex min-h-screen flex-col bg-background text-foreground">
      {/* Navbar */}
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="logo"
                height={30}
                width={30}
                className="mr-2"
              />
              <Link href="/" className="text-2xl font-bold text-primary">
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
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex grow items-center justify-center px-4">
        <div className="text-center">
          \
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
            One stop platform for all your financial needs.
            <br />
            The only financial plan you&apos;ll ever need.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link href="/chat">Chat with bot</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/quiz">Analyze yourself</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FinIQ. All rights reserved.
            </p>
            <div className="flex space-x-4"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
