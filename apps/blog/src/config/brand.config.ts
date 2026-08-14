import type { CSSProperties } from "react";

export const blogBrandConfig = {
  collaborator: "Editorial Partner",
  colors: {
    accentDark: "oklch(0.78 0.14 155)",
    accentLight: "oklch(0.52 0.15 155)",
  },
  contact: {
    email: "hello@example.com",
    github: "https://github.com/example",
    linkedin: "https://linkedin.com/in/example",
  },
  defaultLocale: "en",
  description:
    "A multilingual journal for thoughtful work, durable systems, and the people who build them.",
  motif: "editorial-grid",
  name: "Your Studio",
  siteUrl: "https://your-domain.com",
} as const;

type BrandStyle = CSSProperties & {
  "--brand-accent-dark": string;
  "--brand-accent-light": string;
};

export function createBlogBrandStyle(): BrandStyle {
  return {
    "--brand-accent-dark": blogBrandConfig.colors.accentDark,
    "--brand-accent-light": blogBrandConfig.colors.accentLight,
  };
}
