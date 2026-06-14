import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "./toast";
import { ErrorBoundary } from "./error-boundary";
import { CommandPalette } from "./cmdk";

export const metadata: Metadata = {
  title: "Modules",
  description: "Tool modules",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(!t){t=window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ErrorBoundary>
          <ToastProvider>
            {children}
            <CommandPalette />
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
