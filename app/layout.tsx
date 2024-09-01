import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import AuthButton from "@/components/AuthButton";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Frendere - Your Language Learning Companion",
  description:
    "Master new languages with Frendere's interactive lessons, tracking, and community support.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-neutral-1 text-neutral-11">
        <div className="min-h-screen flex flex-col items-center">
          <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <nav className="w-full flex justify-center h-16 sticky top-0 z-50 backdrop-blur bg-neutral-1/40 transition-all duration-300">
              <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
                <Link
                  href="/"
                  className="no-underline font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-primary-9 via-primary-10 to-primary-11 transition-[background-size] duration-500 ease-in-out hover:bg-gradient-to-l hover:from-primary-10 hover:via-primary-11 hover:to-primary-12 hover:bg-[length:200%_200%] bg-[length:100%_100%]"
                >
                  Frendere
                </Link>
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                  <AuthButton />
                </div>
              </div>
            </nav>

            <div className="flex-1 flex flex-col gap-20 w-full max-w-4xl px-3">
              <main className="flex-1 flex flex-col gap-6">{children}</main>
            </div>

            <footer className="w-full border-t border-t-neutral-6 p-8">
              <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
                <p className="text-sm">
                  &copy; {new Date().getFullYear()} Frendere. All rights
                  reserved.
                </p>
                <div className="flex gap-4">
                  <Link href="/about" className="text-sm hover:underline">
                    About Us
                  </Link>
                  <Link href="/privacy" className="text-sm hover:underline">
                    Privacy Policy
                  </Link>
                  <Link href="/contact" className="text-sm hover:underline">
                    Contact
                  </Link>
                </div>
              </div>
              <p className="text-center text-sm mt-4">
                Designed with care by the Frendere team.
              </p>
            </footer>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
