import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import {
  OrganizationSwitcher,
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { ClerkThemeProvider } from "./clerk-theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lanes",
  description:
    "A shared task board for every team. Each organization gets its own private board.",
};

function LanesMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 32 32" aria-hidden="true">
      <rect x="5" y="7" width="6" height="18" rx="3" fill="currentColor" opacity="0.35" />
      <rect x="13" y="7" width="6" height="13" rx="3" fill="currentColor" opacity="0.65" />
      <rect x="21" y="7" width="6" height="8" rx="3" fill="currentColor" />
    </svg>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkThemeProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="flex min-h-full flex-col">
          <header className="sticky top-0 z-10 border-b border-border bg-page/85 backdrop-blur">
            <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm font-semibold tracking-tight"
              >
                <LanesMark />
                Lanes
              </Link>

              <div className="flex items-center gap-3">
                <Show when="signed-out">
                  <SignInButton>
                    <button className="cursor-pointer rounded-md px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground">
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="cursor-pointer rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90">
                      Sign up
                    </button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <OrganizationSwitcher />
                  <UserButton />
                </Show>
              </div>
            </div>
          </header>

          {children}

          <footer className="border-t border-border">
            <div className="mx-auto w-full max-w-5xl px-5 py-6 text-xs text-muted sm:px-8">
              Lanes — a multi-tenant demo built with Next.js, Prisma, Neon, and
              Clerk.
            </div>
          </footer>
        </body>
      </html>
    </ClerkThemeProvider>
  );
}
