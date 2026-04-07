import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/QueryProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const title = "FocusTube - Distraction-Free YouTube Learning";
  const description =
    "Transform YouTube into structured courses with AI summaries, timestamped notes, progress tracking, and distraction-free learning.";

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: [
      "FocusTube",
      "YouTube learning",
      "AI summaries",
      "distraction-free learning",
      "playlist courses",
      "progress tracking",
      "markdown notes",
    ],
    authors: [{ name: "Md. Kamrul Hasan" }],
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: "FocusTube",
      images: [
        {
          url: "/FocusTube.png",
          width: 512,
          height: 512,
          alt: "FocusTube logo",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/FocusTube.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>{children}</QueryProvider>
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
