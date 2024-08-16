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
      <body className="bg-white dark:bg-slate-950 text-slate-950 dark:text-slate-50">
        <div className="min-h-screen flex flex-col items-center">
          <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <nav className="w-full flex justify-center border-b border-b-slate-200 dark:border-b-slate-800 h-16">
              <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
                <Link
                  href="/"
                  className="no-underline text-foreground hover:underline"
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

            <footer className="w-full border-t border-t-slate-200 dark:border-t-slate-800 p-8">
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
