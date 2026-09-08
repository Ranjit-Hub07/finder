import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Finder – Find Your Dream Job in India & Abroad",
  description:
    "Finder is India's trusted job portal connecting job seekers with top recruiters across private, government, walk-in, and overseas opportunities.",
  keywords:
    "jobs, job portal, job search, India jobs, government jobs, private jobs, work from home, finder",
  authors: [{ name: "Finder" }],
  robots: "index, follow",
  openGraph: {
    title: "Finder – Find Your Dream Job",
    description: "Connect with top recruiters across India & abroad on Finder.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
