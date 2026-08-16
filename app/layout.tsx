import type { Metadata } from "next";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Romeo Flix",
    template: "%s | Romeo Flix"
  },
  description: "Premium Myanmar subtitle movie experience"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}

        <footer className="footer">
          <strong>Romeo Flix</strong>
          <p>Content ကို တရားဝင်ဖြန့်ချိခွင့်ရှိမှသာ ထည့်သွင်းပါ။</p>
        </footer>
      </body>
    </html>
  );
}
