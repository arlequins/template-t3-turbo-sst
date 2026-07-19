import { ThemeProvider, ThemeToggle } from "@acme/ui/theme";
import { Toaster } from "@acme/ui/toast";
import type { Metadata, Viewport } from "next";

import { OidcAuthProvider } from "~/auth/provider";
import { TRPCReactProvider } from "~/trpc/react";

import "~/app/styles.css";

export const metadata: Metadata = {
  title: "Create T3 Turbo",
  description:
    "Static Next.js client — API served separately (e.g. behind CloudFront)",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-screen font-sans antialiased">
        <ThemeProvider>
          <OidcAuthProvider>
            <TRPCReactProvider>{props.children}</TRPCReactProvider>
          </OidcAuthProvider>
          <div className="absolute right-4 bottom-4">
            <ThemeToggle />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
