import type { Metadata } from "next"
import type React from "react"
import "./globals.css"
import { StoreProvider } from "@/lib/store"
import Header from "@/components/app/Header"
import Footer from "@/components/app/Footer"

export const metadata: Metadata = {
  metadataBase: new URL("https://jitume.agency"),
  title: {
    default: "Jitume AIMS — AI Talent Marketplace",
    template: "%s · Jitume AIMS",
  },
  description:
    "Jitume AIMS is an AI-Driven Talent Marketplace connecting high-value client project demands with verified creator supply via an automated AI Matchmaker engine.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StoreProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  )
}
