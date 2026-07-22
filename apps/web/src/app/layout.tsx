import { ThemeProvider } from "@acme/ui/theme";
import { Toaster } from "@acme/ui/toast";
import type { Metadata, Viewport } from "next";

import { OidcAuthProvider } from "~/auth/provider";
import { AppShell } from "~/components/blog/app-shell";
import { TRPCReactProvider } from "~/trpc/react";

import "~/app/styles.css";

export const metadata: Metadata = {
  title: {
    default: "Northstar Editorial Studio",
    template: "%s | Northstar",
  },
  description:
    "A reusable editorial dashboard template built with Next.js and tRPC.",
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
            <TRPCReactProvider>
              <AppShell>{props.children}</AppShell>
            </TRPCReactProvider>
          </OidcAuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
