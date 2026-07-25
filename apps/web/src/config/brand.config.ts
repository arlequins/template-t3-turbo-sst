import type { CSSProperties } from "react";

export const BrandMotif = {
  PUBLICATION: "publication",
  STUDIO: "studio",
  WORKSPACE: "workspace",
} as const;
export type BrandMotif = (typeof BrandMotif)[keyof typeof BrandMotif];

export type BrandConfig = {
  collaborator: string | null;
  colors: {
    accentDark: string;
    accentLight: string;
  };
  description: string;
  motif: BrandMotif;
  name: string;
  shortName: string;
  user: {
    initials: string;
    name: string;
    role: string;
  };
};

export const brandConfig = {
  collaborator: null,
  colors: {
    accentDark: "oklch(0.7 0.16 264)",
    accentLight: "oklch(0.55 0.21 264)",
  },
  description:
    "A reusable application workspace built with Next.js, Hono, and tRPC.",
  motif: BrandMotif.PUBLICATION,
  name: "Acme Workspace",
  shortName: "AW",
  user: {
    initials: "TU",
    name: "Template User",
    role: "Administrator",
  },
} as const satisfies BrandConfig;

type BrandStyle = CSSProperties & {
  "--brand-accent-dark": string;
  "--brand-accent-light": string;
};

export function createBrandStyle(config: BrandConfig): BrandStyle {
  return {
    "--brand-accent-dark": config.colors.accentDark,
    "--brand-accent-light": config.colors.accentLight,
  };
}
