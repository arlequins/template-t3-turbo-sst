import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { blogBrandConfig } from "~/config/brand.config";
import type { Locale } from "~/lib/i18n";
import { localizedPath, messages } from "~/lib/i18n";

import { LanguageSwitcher } from "./language-switcher";
import { ThemeSwitcher } from "./theme-switcher";

export function SiteHeader(props: { locale: Locale }) {
  return (
    <header className="site-header">
      <Link className="wordmark" href={localizedPath(props.locale)}>
        {blogBrandConfig.name}
      </Link>
      <nav aria-label="Primary navigation" className="header-actions">
        <Link
          className="writing-link"
          href={`${localizedPath(props.locale)}#writing`}
        >
          {messages[props.locale].allPosts}
          <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
        <LanguageSwitcher locale={props.locale} />
        <ThemeSwitcher />
      </nav>
    </header>
  );
}
