import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { SiteFooter } from "~/components/site-footer";
import { SiteHeader } from "~/components/site-header";
import { findPublishedPost, listPublishedPosts } from "~/lib/content";
import { isLocale, Locales, localizedPath } from "~/lib/i18n";
import { createLocalizedMetadata } from "~/lib/seo";

export async function generateStaticParams() {
  const entries = await Promise.all(
    Locales.map(async (locale) =>
      (await listPublishedPosts(locale)).map((post) => ({
        locale,
        slug: post.slug,
      })),
    ),
  );
  return entries.flat();
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await props.params;
  if (!isLocale(locale)) return {};
  const post = await findPublishedPost(locale, slug);
  if (!post) return {};
  return createLocalizedMetadata({
    description: post.description,
    image: post.image,
    locale,
    path: `posts/${post.slug}`,
    title: post.title,
  });
}

export default async function PostPage(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await props.params;
  if (!isLocale(locale)) notFound();
  const post = await findPublishedPost(locale, slug);
  if (!post) notFound();

  return (
    <div lang={locale}>
      <SiteHeader locale={locale} />
      <main className="article-shell">
        <Link className="back-link" href={localizedPath(locale)}>
          <ArrowLeft aria-hidden="true" size={17} />
          {locale === "ko"
            ? "모든 글"
            : locale === "ja"
              ? "すべての記事"
              : "All writing"}
        </Link>
        <header className="article-header">
          <div className="post-meta">
            <span>{post.category}</span>
            <time dateTime={post.publishedAt}>{post.publishedAt}</time>
          </div>
          <h1>{post.title}</h1>
          <p>{post.description}</p>
        </header>
        <article className="article-body">
          <MDXRemote source={post.body} />
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
