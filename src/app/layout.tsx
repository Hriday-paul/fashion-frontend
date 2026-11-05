import type { Metadata } from "next";
import "./globals.css";
import { Figtree } from "next/font/google";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import TopInfo from "@/components/shared/Navbar/TopInfo";
import "react-pagination-bar/dist/index.css";
import NextTopLoader from "nextjs-toploader";
import Providers from "@/lib/provider/Providers";
import { Toaster } from "sonner";
import SocketProvider from "@/Context/SocketProvider";
import { GetRates } from "@/lib/services/Rates.api";
import SetRates from "@/components/shared/SetRates";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Fashion",
    template: "%s | Fashion",
  },
  description: "The Best Fashion Store. The Official website for fashion.",
};

type Rate = {
  base: string;
  quote: string;
  rate: number;
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const rates = await GetRates();

  return (
    <html lang="en">
      <body className={`${figtree.className} antialiased`}>
        <Providers>

          {/* <TopInfo></TopInfo> */}

          <SetRates rates={rates || []} />

          <div className="sticky top-0 z-50 ">
            <Navbar></Navbar>
          </div>

          <div
            className="min-h-[calc(100vh-140px)] md:pb-16 pb-8"
          // className=""
          >
            <SocketProvider>
              {children}
            </SocketProvider>
          </div>

          <Footer></Footer>


          <NextTopLoader
            color="#000"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={true}
            easing="ease"
            speed={200}
            shadow="0 0 10px #232323,0 0 5px #EA5326"
            zIndex={1600}
            showAtBottom={false}
          />
          <Toaster richColors={true} position="top-center" />
        </Providers >
        {/* <ScrollLoader></ScrollLoader> */}
      </body>
    </html>
  );
}
