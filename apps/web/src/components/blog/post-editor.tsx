"use client";

import type { RouterInputs } from "@acme/trpc/client";
import { getTrpcUserFacingMessage } from "@acme/trpc/client";
import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import { Select } from "@acme/ui/select";
import { Skeleton } from "@acme/ui/skeleton";
import { Textarea } from "@acme/ui/textarea";
import { toast } from "@acme/ui/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  Download,
  Eye,
  FileClock,
  Languages,
  RotateCcw,
  Save,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { FileUploadField } from "~/components/content/file-upload-field";
import { useTRPC } from "~/trpc/react";

type EditorDraft = Omit<RouterInputs["post"]["create"], "publishedAt"> & {
  publishedAt: string;
};

const emptyDraft: EditorDraft = {
  category: "notes",
  content: "",
  description: "",
  featured: false,
  image: "/blog/editorial-workspace.jpg",
  imageAlt: "Editorial workspace with a notebook and laptop",
  locale: "en",
  publishedAt: "",
  slug: "",
  status: "draft",
  title: "",
  translationKey: "",
};

const locales = [
  { label: "English", value: "en" },
  { label: "日本語", value: "ja" },
  { label: "한국어", value: "ko" },
] as const;

const categories = [
  { label: "Design", value: "design" },
  { label: "Engineering", value: "engineering" },
  { label: "Notes", value: "notes" },
] as const;

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 256);
}

function toDraft(
  value: RouterInputs["post"]["create"] & { publishedAt: Date | null },
): EditorDraft {
  return {
    ...value,
    publishedAt: value.publishedAt?.toISOString().slice(0, 10) ?? "",
  };
}

function toInput(draft: EditorDraft): RouterInputs["post"]["create"] {
  return {
    ...draft,
    publishedAt: draft.publishedAt
      ? new Date(`${draft.publishedAt}T00:00:00Z`)
      : null,
  };
}

function downloadMdx(draft: EditorDraft) {
  const frontmatter = [
    "---",
    `title: ${JSON.stringify(draft.title)}`,
    `description: ${JSON.stringify(draft.description)}`,
    `category: ${draft.category}`,
    `reviewStatus: ${draft.status}`,
    `publishedAt: ${draft.publishedAt || "null"}`,
    `translationKey: ${draft.translationKey}`,
    `image: ${JSON.stringify(draft.image)}`,
    `imageAlt: ${JSON.stringify(draft.imageAlt)}`,
    `featured: ${String(draft.featured)}`,
    "---",
  ].join("\n");
  const blob = new Blob([`${frontmatter}\n\n${draft.content.trim()}\n`], {
    type: "text/markdown;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.download = `${draft.slug}.${draft.locale}.mdx`;
  anchor.href = url;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function PostEditor() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const id = useSearchParams().get("id");
  const storageKey = `content-editor:${id ?? "new"}`;
  const [preview, setPreview] = useState(false);
  const [draft, setDraft] = useState<EditorDraft>(emptyDraft);
  const [restored, setRestored] = useState(false);
  const existing = useQuery(
    trpc.post.byId.queryOptions({ id: id ?? "" }, { enabled: Boolean(id) }),
  );
  const translations = useQuery(
    trpc.post.all.queryOptions(
      {
        direction: "asc",
        page: 1,
        pageSize: 50,
        query: draft.translationKey,
        sort: "title",
      },
      { enabled: draft.translationKey.length > 0 },
    ),
  );

  useEffect(() => {
    if (existing.data) {
      setDraft(toDraft(existing.data));
      return;
    }
    if (id) return;
    const stored = window.sessionStorage.getItem(storageKey);
    if (!stored) return;
    try {
      setDraft(JSON.parse(stored) as EditorDraft);
      setRestored(true);
    } catch {
      window.sessionStorage.removeItem(storageKey);
    }
  }, [existing.data, id, storageKey]);

  useEffect(() => {
    if (id || draft === emptyDraft) return;
    const timeout = window.setTimeout(() => {
      window.sessionStorage.setItem(storageKey, JSON.stringify(draft));
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [draft, id, storageKey]);

  const translatedLocales = useMemo(
    () =>
      new Set(
        translations.data?.items
          .filter((item) => item.translationKey === draft.translationKey)
          .map((item) => item.locale) ?? [],
      ),
    [draft.translationKey, translations.data],
  );

  const mutationOptions = {
    onError: (error: unknown) => toast.error(getTrpcUserFacingMessage(error)),
    onSuccess: async () => {
      window.sessionStorage.removeItem(storageKey);
      toast.success(id ? "Content updated" : "Content created");
      await queryClient.invalidateQueries(trpc.post.pathFilter());
      router.push("/posts/");
    },
  };
  const createPost = useMutation(
    trpc.post.create.mutationOptions(mutationOptions),
  );
  const updatePost = useMutation(
    trpc.post.update.mutationOptions(mutationOptions),
  );
  const save = () => {
    const data = toInput(draft);
    if (id && existing.data)
      updatePost.mutate({
        data: { ...data, version: existing.data.version },
        id,
      });
    else createPost.mutate(data);
  };
  const isSaving = createPost.isPending || updatePost.isPending;
  const canSave =
    draft.title.trim().length > 0 &&
    draft.slug.length > 0 &&
    draft.translationKey.length > 0 &&
    draft.description.trim().length >= 20 &&
    draft.content.trim().length > 0 &&
    draft.imageAlt.trim().length > 0;

  const update = <Key extends keyof EditorDraft>(
    key: Key,
    value: EditorDraft[Key],
  ) => setDraft((current) => ({ ...current, [key]: value }));

  if (id && existing.isPending)
    return <Skeleton className="h-[620px] w-full" />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-muted-foreground text-xs">
            {id ? "Editing managed content" : "New localized content"}
          </p>
          <h1 className="mt-1 text-xl font-semibold">Content studio</h1>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Button
            onClick={() => setPreview((value) => !value)}
            variant="outline"
          >
            <Eye />
            {preview ? "Edit content" : "Preview"}
          </Button>
          <Button
            disabled={!canSave}
            onClick={() => downloadMdx(draft)}
            variant="outline"
          >
            <Download />
            Export MDX
          </Button>
          <Button disabled={isSaving || !canSave} onClick={save}>
            <Save />
            {isSaving ? "Saving" : "Save"}
          </Button>
        </div>
      </div>

      {restored && (
        <div className="bg-primary/8 border-primary/20 flex items-center gap-3 rounded-md border px-4 py-3 text-sm">
          <RotateCcw className="text-primary size-4" />
          Restored an unsaved draft from this browser session.
          <Button
            className="ml-auto"
            onClick={() => {
              setDraft(emptyDraft);
              setRestored(false);
              window.sessionStorage.removeItem(storageKey);
            }}
            size="sm"
            variant="ghost"
          >
            Discard
          </Button>
        </div>
      )}

      {preview ? (
        <article className="bg-background overflow-hidden rounded-lg border shadow-xs">
          <div className="relative aspect-[4/3] sm:aspect-[16/7]">
            <Image
              alt={draft.imageAlt || "Content preview"}
              className="object-cover"
              fill
              sizes="100vw"
              src={draft.image}
            />
          </div>
          <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
            <div className="text-primary flex items-center gap-2 text-xs font-semibold uppercase">
              {draft.category}
              <span className="text-muted-foreground">·</span>
              {draft.locale}
              <span className="text-muted-foreground">·</span>
              {draft.status}
            </div>
            <h2 className="mt-4 font-serif text-3xl sm:text-5xl">
              {draft.title || "Untitled content"}
            </h2>
            <p className="text-muted-foreground mt-4 text-lg leading-8">
              {draft.description ||
                "Add a description to complete the preview."}
            </p>
            <div className="mt-9 space-y-5 font-serif leading-8">
              {draft.content.split("\n\n").map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </article>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="bg-background space-y-5 rounded-lg border p-4 shadow-xs sm:p-7">
            <label className="block text-sm font-medium" htmlFor="post-title">
              Title
              <Input
                className="mt-2 h-11 text-lg"
                id="post-title"
                onChange={(event) => {
                  const title = event.target.value;
                  setDraft((current) => {
                    const generated = slugify(title);
                    return {
                      ...current,
                      title,
                      slug: current.slug ? current.slug : generated,
                      translationKey: current.translationKey
                        ? current.translationKey
                        : generated,
                    };
                  });
                }}
                value={draft.title}
              />
            </label>
            <label
              className="block text-sm font-medium"
              htmlFor="post-description"
            >
              Description
              <Textarea
                className="mt-2 min-h-24"
                id="post-description"
                maxLength={240}
                onChange={(event) => update("description", event.target.value)}
                value={draft.description}
              />
              <span className="text-muted-foreground mt-1 block text-xs">
                {draft.description.length}/240
              </span>
            </label>
            <label className="block text-sm font-medium" htmlFor="content-body">
              Body
              <Textarea
                className="bg-background mt-2 min-h-96 w-full rounded-md border p-4 font-mono text-sm leading-7"
                id="content-body"
                onChange={(event) => update("content", event.target.value)}
                value={draft.content}
              />
            </label>
          </section>

          <aside className="space-y-5">
            <section className="bg-background rounded-lg border p-5 shadow-xs">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <FileClock className="size-4" />
                Publication
              </h2>
              <div className="mt-4 space-y-4">
                <label
                  className="block text-sm font-medium"
                  htmlFor="content-category"
                >
                  Category
                  <Select
                    className="mt-2"
                    id="content-category"
                    onChange={(event) =>
                      update(
                        "category",
                        event.target.value as EditorDraft["category"],
                      )
                    }
                    value={draft.category}
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </Select>
                </label>
                <label
                  className="block text-sm font-medium"
                  htmlFor="review-status"
                >
                  Review status
                  <Select
                    className="mt-2"
                    id="review-status"
                    onChange={(event) =>
                      update(
                        "status",
                        event.target.value as EditorDraft["status"],
                      )
                    }
                    value={draft.status}
                  >
                    <option value="draft">Draft</option>
                    <option value="in-review">In review</option>
                    <option value="approved">Approved</option>
                  </Select>
                </label>
                {draft.status === "approved" && !draft.publishedAt && (
                  <p className="text-destructive text-xs">
                    Approved content requires a publish date.
                  </p>
                )}
                <label
                  className="block text-sm font-medium"
                  htmlFor="publish-date"
                >
                  Publish date
                  <Input
                    className="mt-2"
                    id="publish-date"
                    onChange={(event) =>
                      update("publishedAt", event.target.value)
                    }
                    type="date"
                    value={draft.publishedAt}
                  />
                </label>
                <label className="flex items-center gap-3 text-sm font-medium">
                  <input
                    checked={draft.featured}
                    className="size-4"
                    onChange={(event) =>
                      update("featured", event.target.checked)
                    }
                    type="checkbox"
                  />
                  Feature this content
                </label>
              </div>
            </section>

            <section className="bg-background rounded-lg border p-5 shadow-xs">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <Languages className="size-4" />
                Localization
              </h2>
              <div className="mt-4 space-y-4">
                <label
                  className="block text-sm font-medium"
                  htmlFor="content-locale"
                >
                  Language
                  <Select
                    className="mt-2"
                    id="content-locale"
                    onChange={(event) =>
                      update(
                        "locale",
                        event.target.value as EditorDraft["locale"],
                      )
                    }
                    value={draft.locale}
                  >
                    {locales.map((locale) => (
                      <option key={locale.value} value={locale.value}>
                        {locale.label}
                      </option>
                    ))}
                  </Select>
                </label>
                <label
                  className="block text-sm font-medium"
                  htmlFor="translation-key"
                >
                  Translation key
                  <Input
                    className="mt-2"
                    id="translation-key"
                    onChange={(event) =>
                      update("translationKey", slugify(event.target.value))
                    }
                    value={draft.translationKey}
                  />
                </label>
                <label
                  className="block text-sm font-medium"
                  htmlFor="content-slug"
                >
                  URL slug
                  <Input
                    className="mt-2"
                    id="content-slug"
                    onChange={(event) =>
                      update("slug", slugify(event.target.value))
                    }
                    value={draft.slug}
                  />
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {locales.map((locale) => (
                    <span
                      className="bg-muted flex items-center justify-center gap-1 rounded-md px-2 py-2 text-xs"
                      key={locale.value}
                    >
                      {translatedLocales.has(locale.value) && (
                        <Check className="text-primary size-3" />
                      )}
                      {locale.value.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-background rounded-lg border p-5 shadow-xs">
              <h2 className="text-sm font-semibold">Media</h2>
              <div className="mt-4 space-y-4">
                <label
                  className="block text-sm font-medium"
                  htmlFor="image-path"
                >
                  Image path
                  <Input
                    className="mt-2"
                    id="image-path"
                    onChange={(event) => update("image", event.target.value)}
                    value={draft.image}
                  />
                </label>
                <label
                  className="block text-sm font-medium"
                  htmlFor="image-alt"
                >
                  Alternative text
                  <Input
                    className="mt-2"
                    id="image-alt"
                    onChange={(event) => update("imageAlt", event.target.value)}
                    value={draft.imageAlt}
                  />
                </label>
                <FileUploadField />
              </div>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
