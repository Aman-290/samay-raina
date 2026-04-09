import type { Metadata } from "next";
import { 
  Anton, Space_Mono, DM_Sans, Caveat, Playfair_Display,
  Permanent_Marker, Indie_Flower, Kalam, Amatic_SC, Shadows_Into_Light 
} from "next/font/google";
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

const kalam = Kalam({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-kalam",
  display: "swap",
});

const amatic = Amatic_SC({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-amatic",
  display: "swap",
});

const shadows = Shadows_Into_Light({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-shadows",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Samay Raina — The Jail Break | A Tribute by Brokai Labs",
  description:
    "From Kashmir to Madison Square Garden. A scroll-driven tribute to India's most uncancellable comedian.",
  openGraph: {
    title: "Samay Raina — The Jail Break | A Tribute by Brokai Labs",
    description:
      "From Kashmir to Madison Square Garden. A scroll-driven tribute to India's most uncancellable comedian.",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Samay Raina — The Jail Break | A Tribute by Brokai Labs",
    description:
      "From Kashmir to Madison Square Garden. A scroll-driven tribute to India's most uncancellable comedian.",
    images: ["/images/og-image.jpg"],
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
      className={`${anton.variable} ${spaceMono.variable} ${dmSans.variable} ${caveat.variable} ${playfair.variable} ${marker.variable} ${indie.variable} ${kalam.variable} ${amatic.variable} ${shadows.variable}`}
    >
      <body className="font-dm bg-cell text-chalk">{children}</body>
    </html>
  );
}
