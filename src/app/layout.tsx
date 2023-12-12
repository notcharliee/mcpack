import "@/styles/globals.css"
import "@/styles/keyframes.css"

import { Roboto } from "next/font/google"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--font-sans",
})

export const metadata = {
  title: "Resource Pack Builder",
  description: "Built by @notcharliee on GitHub",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${roboto.variable}`}>
        <div className="pointer-events-none fixed z-50 h-full w-full overflow-hidden opacity-90 before:absolute before:-left-1/2 before:-top-1/2 before:h-[200%] before:w-[200%] before:animate-[noise_1.2s_steps(3)_both_infinite] before:bg-[url(/background-noise.png)] before:opacity-30"></div>
        {children}
      </body>
    </html>
  )
}
