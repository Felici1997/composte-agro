import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
  title: "Composte - Le marché agricole",
  description: "Composte - Le marché agricole : annonces de matériel agricole, élevage, terrains, services et vente directe producteur",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2d6a4f" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className={`${outfit.className} antialiased`}>
        <StoreProvider>
          <Toaster />
          {children}
        </StoreProvider>
        <script dangerouslySetInnerHTML={{
          __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js')})}`,
        }} />
      </body>
    </html>
  );
}
