import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "../providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import { zhCN } from "@clerk/localizations";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={zhCN}>
      <QueryProvider>
        <html lang="en" suppressHydrationWarning>
          <body>
            {children}
            <Toaster />
          </body>
        </html>
      </QueryProvider>
    </ClerkProvider>
  );
}
