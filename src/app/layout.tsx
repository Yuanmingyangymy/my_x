import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "../providers/QueryProvider";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <QueryProvider>
        <html lang="en">
          <body>
            {children}
            <Toaster />
          </body>
        </html>
      </QueryProvider>
    </ClerkProvider>
  );
}
