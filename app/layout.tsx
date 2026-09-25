import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import SmoothScroll from "@/components/motion/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import Header from "@/components/ui/Header";
import NavigationOverlay from "@/components/ui/NavigationOverlay";
import VideoReelModal from "@/components/ui/VideoReelModal";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "STUDIO PROTO — Creative Studio & Digital Experience Lab",
  description: "Next-generation digital experiences, interactive design systems, and real-time WebGL installations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased selection:bg-accent-cyan selection:text-bg-dark">
        <SmoothScroll>
          <CustomCursor />
          <Header />
          <NavigationOverlay />
          <VideoReelModal />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
