import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.scss";

import { ChatStoreProvider } from "@/providers/chat-store-provider";
import { InteractionStoreProvider } from "@/providers/interaction-store-provider";
import { TtsStoreProvider } from "@/providers/tts-store-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <TtsStoreProvider>
          <ChatStoreProvider>
            <InteractionStoreProvider>{children}</InteractionStoreProvider>
          </ChatStoreProvider>
        </TtsStoreProvider>
      </body>
    </html>
  );
}
