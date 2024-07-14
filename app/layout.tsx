import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from '@/components/ui/sonner';
import AuthButton from '@/components/AuthButton';
import Link from 'next/link';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={GeistSans.className}>
      <body className='bg-background text-foreground'>
        <div className='min-h-screen flex flex-col items-center'>
          <div className='flex-1 w-full flex flex-col gap-20 items-center'>
            <nav className='w-full flex justify-center border-b border-b-foreground/10 h-16'>
              <div className='w-full max-w-4xl flex justify-between items-center p-3 text-sm'>
                <Link href='/' className='no-underline text-foreground hover:underline'>
                  Home
                </Link>
                <AuthButton />
              </div>
            </nav>

            <div className='flex-1 flex flex-col gap-20 w-full max-w-4xl px-3'>
              <main className='flex-1 flex flex-col gap-6'>{children}</main>
            </div>

            <footer className='w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs'>
              <p>
                Powered by{' '}
                <a
                  href='https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs'
                  target='_blank'
                  className='font-bold hover:underline'
                  rel='noreferrer'
                >
                  Supabase
                </a>
              </p>
            </footer>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
