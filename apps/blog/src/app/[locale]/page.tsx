import { notFound } from "next/navigation";

import { BlogHome } from "~/components/blog-home";
import { blogBrandConfig } from "~/config/brand.config";
import { isLocale, Locales } from "~/lib/i18n";
import { createLocalizedMetadata } from "~/lib/seo";

export function generateStaticParams() {
  return Locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!isLocale(locale)) return {};
  return createLocalizedMetadata({
    description: blogBrandConfig.description,
    image: "/blog/editorial-workspace.jpg",
    locale,
    title: blogBrandConfig.name,
  });
}

export default async function LocalizedHomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  return (
    <div lang={locale}>
      <BlogHome locale={locale} />
    </div>
  );
}
