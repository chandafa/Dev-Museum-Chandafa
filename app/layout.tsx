import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Outfit } from "next/font/google";
import "./globals.css";
import { SmoothProvider } from "@/components/smooth-provider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap"
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dev-museum.vercel.app";
const ownerName = process.env.NEXT_PUBLIC_OWNER_NAME || "Candra Kirana";
const siteTitle = "Dev Museum — GitHub Powered Project Archive";
const siteDescription = "A cinematic GitHub-powered developer museum that automatically curates repositories, tech stacks, activity, project health, and build history.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Dev Museum",
  title: {
    default: siteTitle,
    template: "%s — Dev Museum"
  },
  description: siteDescription,
  keywords: [
    "Dev Museum",
    "GitHub portfolio",
    "developer archive",
    "creative developer",
    "Next.js portfolio",
    "Awwwards portfolio",
    "repository showcase",
    "project archive",
    "Candra Kirana"
  ],
  authors: [{ name: ownerName, url: siteUrl }],
  creator: ownerName,
  publisher: ownerName,
  category: "portfolio",
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: "/mark.svg",
    shortcut: "/mark.svg",
    apple: "/mark.svg"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: siteTitle,
    siteName: "Dev Museum",
    description: siteDescription,
    images: [
      {
        url: "/mark.svg",
        width: 512,
        height: 512,
        alt: "Dev Museum mark"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    creator: "@ck271138"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  other: {
    copyright: `© ${new Date().getFullYear()} ${ownerName}. All rights reserved.`,
    "theme-color": "#0d0e10",
    "msapplication-TileColor": "#0d0e10"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d0e10" },
    { media: "(prefers-color-scheme: light)", color: "#f6f3eb" }
  ]
};

const themeScript = `
(function () {
  try {
    var saved = localStorage.getItem('dev-museum-theme');
    document.documentElement.dataset.theme = saved === 'light' ? 'light' : 'dark';
  } catch (_) {
    document.documentElement.dataset.theme = 'dark';
  }
})();`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SmoothProvider>{children}</SmoothProvider>
      </body>
    </html>
  );
}
