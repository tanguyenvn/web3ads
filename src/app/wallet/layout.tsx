import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster"

import "../globals.css";


export const metadata: Metadata = {
  title: "Wallet App",
  description: "Wallet App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="grid justify-self-center max-w-xl" >
    <div className=""> 
        {children}
        <Toaster />
    </div>
  </div>
}
