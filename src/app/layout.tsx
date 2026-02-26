import type { Metadata } from "next"
import "./globals.css"
import { Manrope } from "next/font/google"
import { Toaster } from "react-hot-toast"
import ReduxProvider from "@/components/providers/ReduxProvider"
import AuthGuard from "@/components/guards/AuthGuard"

const manrope = Manrope({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recuro",
  description: "Screen recording platform with AI based transcription"
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={manrope.className}>
      <body className="bg-bg text-text min-h-dvh antialiased">
        <ReduxProvider>
          <AuthGuard>
            <main>
              {children}
            </main>
          </AuthGuard>
          <Toaster
            toastOptions={{
              duration: 3000
            }} />
        </ReduxProvider>
      </body>
    </html>
  );
};

export default Layout;