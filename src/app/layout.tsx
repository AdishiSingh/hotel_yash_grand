import type { Metadata } from "next";
import { Inter, Playfair_Display, Poppins } from "next/font/google";
import { Providers } from "@/app/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-buttons",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hotel Yash Grand | Luxury Restaurant & Banquet Varanasi",
    template: "%s | Hotel Yash Grand Varanasi",
  },
  description: "Experience premium digital hospitality at Hotel Yash Grand Restaurant & Banquet. Book luxury rooms, weddings, corporate events, and fine family dining near SMS College, Varanasi.",
  keywords: ["Hotel Yash Grand Varanasi", "Luxury Room Bookings Varanasi", "Best Banquet Hall Varanasi", "Multi-Cuisine Restaurant Varanasi", "Wedding venue Varanasi", "Family dining Varanasi"],
  metadataBase: new URL("https://hotelyashgrand.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Hotel Yash Grand | Luxury Restaurant & Banquet Varanasi",
    description: "Experience premium digital hospitality at Hotel Yash Grand Restaurant & Banquet. Book luxury rooms, weddings, corporate events, and fine family dining.",
    url: "https://hotelyashgrand.com",
    siteName: "Hotel Yash Grand",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotel Yash Grand | Luxury Restaurant & Banquet Varanasi",
    description: "Experience premium digital hospitality at Hotel Yash Grand Restaurant & Banquet.",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased dark ${inter.variable} ${playfair.variable} ${poppins.variable}`}>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-500 font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
