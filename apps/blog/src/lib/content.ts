import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

import matter from "gray-matter";
import { cache } from "react";
import * as z from "zod/v4";
import type { Locale } from "./i18n";
import { isLocale, Locales } from "./i18n";

export const PostCategory = {
  DESIGN: "design",
  ENGINEERING: "engineering",
  NOTES: "notes",
} as const;
export type PostCategory = (typeof PostCategory)[keyof typeof PostCategory];

export const ReviewStatus = {
  APPROVED: "approved",
  DRAFT: "draft",
  IN_REVIEW: "in-review",
} as const;
export type ReviewStatus = (typeof ReviewStatus)[keyof typeof ReviewStatus];

const FrontmatterSchema = z.object({
  category: z.enum(PostCategory),
  description: z.string().min(20).max(240),
  featured: z.boolean().default(false),
  image: z.string().startsWith("/"),
  imageAlt: z.string().min(1),
  publishedAt: z.iso.date(),
  reviewStatus: z.enum(ReviewStatus),
  title: z.string().min(1).max(120),
  translationKey: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

export type BlogPost = z.output<typeof FrontmatterSchema> & {
  body: string;
  locale: Locale;
  slug: string;
};

const ContentFileSchema = z
  .string()
  .regex(/^([a-z0-9]+(?:-[a-z0-9]+)*)\.(ko|en|ja)\.mdx$/);

const contentDirectory = resolve(process.cwd(), "content/posts");

export function parsePostFile(fileName: string, source: string): BlogPost {
  ContentFileSchema.parse(fileName);
  const [slug, locale] = fileName.replace(/\.mdx$/, "").split(".");
  if (!slug || !locale || !isLocale(locale)) {
    throw new Error(`Invalid localized content filename: ${fileName}`);
  }

  const { content, data } = matter(source);
  const frontmatter = FrontmatterSchema.parse(data);
  if (frontmatter.translationKey !== slug) {
    throw new Error(
      `${fileName}: translationKey must match the filename slug "${slug}"`,
    );
  }
  if (content.trim().length === 0) {
    throw new Error(`${fileName}: MDX body must not be empty`);
  }

  return {
    ...frontmatter,
    body: content.trim(),
    locale,
    slug,
  };
}

export function validateTranslationCoverage(posts: BlogPost[]): void {
  const localesBySlug = new Map<string, Set<Locale>>();
  for (const post of posts) {
    const locales = localesBySlug.get(post.slug) ?? new Set<Locale>();
    if (locales.has(post.locale)) {
      throw new Error(`Duplicate translation: ${post.slug}.${post.locale}.mdx`);
    }
    locales.add(post.locale);
    localesBySlug.set(post.slug, locales);
  }

  for (const [slug, locales] of localesBySlug) {
    const missing = Locales.filter((locale) => !locales.has(locale));
    if (missing.length > 0) {
      throw new Error(
        `${slug}: missing translations for ${missing.join(", ")}`,
      );
    }
  }
}

export const loadAllPosts = cache(async (): Promise<BlogPost[]> => {
  const fileNames = (await readdir(contentDirectory))
    .filter((fileName) => fileName.endsWith(".mdx"))
    .sort();
  const posts = await Promise.all(
    fileNames.map(async (fileName) =>
      parsePostFile(
        fileName,
        await readFile(resolve(contentDirectory, fileName), "utf8"),
      ),
    ),
  );
  validateTranslationCoverage(posts);
  return posts;
});

function isPublished(post: BlogPost, today: string): boolean {
  return (
    post.reviewStatus === ReviewStatus.APPROVED && post.publishedAt <= today
  );
}

export async function listPublishedPosts(
  locale: Locale,
  today = new Date().toISOString().slice(0, 10),
): Promise<BlogPost[]> {
  return (await loadAllPosts())
    .filter((post) => post.locale === locale && isPublished(post, today))
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
}

export async function findPublishedPost(
  locale: Locale,
  slug: string,
): Promise<BlogPost | undefined> {
  const posts = await listPublishedPosts(locale);
  return posts.find((post) => post.slug === slug);
}
