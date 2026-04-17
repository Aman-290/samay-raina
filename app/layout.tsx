import type { Metadata } from "next";
import { 
  Anton, Space_Mono, DM_Sans, Caveat, Playfair_Display,
  Permanent_Marker, Indie_Flower, Rock_Salt, Caveat_Brush, Special_Elite, VT323, Shadows_Into_Light 
} from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from '@next/third-parties/google';
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton-var",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const caveat = Caveat({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-caveat-var",
  display: "swap",
});

const playfair = Playfair_Display({
  weight: ["400", "600", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-playfair-var",
  display: "swap",
});

const marker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marker",
  display: "swap",
});

const indie = Indie_Flower({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-indie",
  display: "swap",
});

const rockSalt = Rock_Salt({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-rock",
  display: "swap",
});

const caveatBrush = Caveat_Brush({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-caveat-brush",
  display: "swap",
});

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-special",
  display: "swap",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt",
  display: "swap",
});

const shadows = Shadows_Into_Light({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-shadows",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://samay-raina-tribute.vercel.app"),
  title: "Samay Raina — The Jail Break | An Interactive Tribute",
  description: "From Kashmir to Madison Square Garden. A highly interactive, scroll-driven web documentary tracking the ultimate comeback of India's most uncancellable comedian, Samay Raina. Experience the chess, the controversies, and the comedy.",
  keywords: ["Samay Raina", "Comedian", "Indian Standup", "Chess", "Madison Square Garden", "Interactive Tribute", "Brokai Labs", "Chessyard", "Jailbreak", "Samay Raina Documentary"],
  authors: [{ name: "Brokai Labs", url: "https://brokailabs.com" }],
  creator: "Brokai Labs",
  publisher: "Brokai Labs",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Samay Raina — The Jail Break",
    description: "From Kashmir to Madison Square Garden. A scroll-driven tribute to India's most uncancellable comedian.",
    url: "/",
    siteName: "Samay Raina Tribute",
    images: [
      { 
        url: "/images/og-image.jpg", 
        width: 1200, 
        height: 630,
        alt: "Samay Raina - The Jail Break",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Samay Raina — The Jail Break",
    description: "From Kashmir to Madison Square Garden. The story of India's most uncancellable man.",
    creator: "@samayraina",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${anton.variable} ${spaceMono.variable} ${dmSans.variable} ${caveat.variable} ${playfair.variable} ${marker.variable} ${indie.variable} ${rockSalt.variable} ${caveatBrush.variable} ${specialElite.variable} ${vt323.variable} ${shadows.variable}`}
    >
      <body className="font-dm bg-cell text-chalk">
        {children}
        <Analytics />
        <GoogleAnalytics gaId="G-T2E5KK8ZJ6" />
      </body>
    </html>
  );
}
