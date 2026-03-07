import NavBar from "@/components/Navbar/Navbar";
import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google";
import AuthProvider from "@/context/AuthContext/AuthProvider";
import QueryWrapper from "@/components/QueryWrapper/QueryWrapper";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export const metadata = {
  title: "ReadMart",
  description: "A e marketplace where any one can buy and sell books",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable}`}>
        <QueryWrapper>
          <AuthProvider>
            <NavBar></NavBar>
            {children}
          </AuthProvider>
        </QueryWrapper>
      </body>
    </html>
  );
}
