import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/component/NavBar/Navbar";
import { Epilogue } from "next/font/google";

const epilogue = Epilogue({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-epilogue', // This creates a CSS variable
});



export const metadata = {
  title: "Quick Hire",
  description: "A app to find jobs quickly",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={epilogue.variable}>
        <Navbar></Navbar>
        {children}
      </body>
    </html>
  );
}
