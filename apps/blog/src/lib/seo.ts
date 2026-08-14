import type { Metadata } from "next";

import { blogBrandConfig } from "~/config/brand.config";
import type { Locale } from "./i18n";
import { Locales, localizedPath } from "./i18n";

type LocalizedMetadataInput = {
  description: string;
  image: string;
  locale: Locale;
  path?: string;
  title: string;
};

const openGraphLocales: Record<Locale, string> = {
  en: "en_US",
  ja: "ja_JP",
  ko: "ko_KR",
};

export function createLocalizedMetadata(
  input: LocalizedMetadataInput,
): Metadata {
  const path = input.path ?? "";
  const canonical = new URL(
    localizedPath(input.locale, path),
    blogBrandConfig.siteUrl,
  );
  const languages = Object.fromEntries(
    Locales.map((locale) => [
      locale,
      new URL(localizedPath(locale, path), blogBrandConfig.siteUrl).toString(),
    ]),
  );

  return {
    alternates: {
      canonical,
      languages,
    },
    description: input.description,
    openGraph: {
      description: input.description,
      images: [
        {
          alt: input.title,
          url: new URL(input.image, blogBrandConfig.siteUrl),
        },
      ],
      locale: openGraphLocales[input.locale],
      siteName: blogBrandConfig.name,
      title: input.title,
      type: path ? "article" : "website",
      url: canonical,
    },
    title: input.title,
    twitter: {
      card: "summary_large_image",
      description: input.description,
      images: [new URL(input.image, blogBrandConfig.siteUrl)],
      title: input.title,
    },
  };
}
