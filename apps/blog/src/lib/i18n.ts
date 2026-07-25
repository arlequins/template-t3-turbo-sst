export const Locales = ["ko", "en", "ja"] as const;
export type Locale = (typeof Locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  ja: "日本語",
  ko: "한국어",
};

export const messages = {
  en: {
    allPosts: "All writing",
    collaboration: "In collaboration with",
    featured: "Featured",
    latest: "Latest notes",
    readArticle: "Read article",
    skipToContent: "Skip to content",
  },
  ja: {
    allPosts: "すべての記事",
    collaboration: "コラボレーション",
    featured: "注目の記事",
    latest: "最新の記事",
    readArticle: "記事を読む",
    skipToContent: "本文へ移動",
  },
  ko: {
    allPosts: "모든 글",
    collaboration: "함께 만든 사람",
    featured: "주요 글",
    latest: "최근 기록",
    readArticle: "글 읽기",
    skipToContent: "본문으로 이동",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export function isLocale(value: string): value is Locale {
  return Locales.includes(value as Locale);
}

export function localizedPath(locale: Locale, path = ""): string {
  const suffix = path.replace(/^\/+|\/+$/g, "");
  return suffix ? `/${locale}/${suffix}/` : `/${locale}/`;
}

export function replacePathLocale(pathname: string, locale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return localizedPath(locale);
  if (isLocale(segments[0] ?? "")) segments[0] = locale;
  else segments.unshift(locale);
  return `/${segments.join("/")}/`;
}
