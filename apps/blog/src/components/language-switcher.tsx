"use client";

import { Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "~/lib/i18n";
import { Locales, localeLabels, replacePathLocale } from "~/lib/i18n";

export function LanguageSwitcher(props: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <label className="language-switcher">
      <Languages aria-hidden="true" size={18} />
      <span className="sr-only">Language</span>
      <select
        aria-label="Language"
        value={props.locale}
        onChange={(event) => {
          router.push(
            replacePathLocale(pathname, event.currentTarget.value as Locale),
          );
        }}
      >
        {Locales.map((locale) => (
          <option key={locale} value={locale}>
            {localeLabels[locale]}
          </option>
        ))}
      </select>
    </label>
  );
}
