import type { Metadata } from "next";

//component
import Toolbar from "@/component/toolbar/toolbar";
import Footer from "@/component/footer/footer";

// global style
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Edu Meet | 메인",
  description: "Edu Meet Main Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toolbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
