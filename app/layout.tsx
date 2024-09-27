import type { Metadata } from "next";
import "./globals.css";
import StarknetProvider from "./StarknetProvider";
import Connect from "./components/connect/Connect";
import Hamburger from "./components/hamburger/hamburger";

export const metadata: Metadata = {
  title: "SeamlessUI",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StarknetProvider>
        <body className={`p-8 antialiased`}>
          <Connect layout="grid" theme="light" />
          <Hamburger theme="dark" />
          {children}
        </body>
      </StarknetProvider>
    </html>
  );
}
