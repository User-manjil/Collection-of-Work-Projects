import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Manjil Aryal Web Portfolio",
  description: "This is my personal web portfolio. I am a full stack developer and I have experience in building web applications using React, Next.js, Node.js, and other technologies. I have also worked on various projects and have a good understanding of web development best practices.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${inter.variable}  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col container-portfolio">
        <Navbar/>
        {children}
        <Footer/>
        </body>
    </html>
  );
}
