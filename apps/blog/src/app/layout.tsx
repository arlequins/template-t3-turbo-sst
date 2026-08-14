import { ThemeProvider } from "@acme/ui/theme";
import type { Metadata, Viewport } from "next";

import { blogBrandConfig, createBlogBrandStyle } from "~/config/brand.config";

import "./styles.css";

export const metadata: Metadata = {
  metadataBase: new URL(blogBrandConfig.siteUrl),
  title: {
    default: blogBrandConfig.name,
    template: `%s | ${blogBrandConfig.name}`,
  },
  description: blogBrandConfig.description,
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f2ed" },
    { media: "(prefers-color-scheme: dark)", color: "#151817" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      data-scroll-behavior="smooth"
      lang={blogBrandConfig.defaultLocale}
      style={createBlogBrandStyle()}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>{props.children}</ThemeProvider>
      </body>
    </html>
  );
}
