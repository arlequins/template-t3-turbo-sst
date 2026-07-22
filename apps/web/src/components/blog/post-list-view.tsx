"use client";

import { Button } from "@acme/ui/button";
import {
  CalendarDays,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { StatusBadge } from "~/components/blog/status-badge";
import type { BlogPost, PostStatus } from "~/lib/blog-data";
import { formatCompactNumber } from "~/lib/blog-data";

const filters: (PostStatus | "All")[] = [
  "All",
  "Published",
  "Draft",
  "Scheduled",
];

export function PostListView(props: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<PostStatus | "All">("All");
  const visiblePosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return props.posts.filter(
      (post) =>
        (status === "All" || post.status === status) &&
        (!normalizedQuery ||
          post.title.toLowerCase().includes(normalizedQuery) ||
          post.author.toLowerCase().includes(normalizedQuery)),
    );
  }, [props.posts, query, status]);

  return (
    <section className="bg-background overflow-hidden rounded-lg border">
      <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center">
        <label className="relative min-w-0 flex-1 md:max-w-sm">
          <Search
            aria-hidden="true"
            className="text-muted-foreground absolute top-2.5 left-3 size-4"
          />
          <span className="sr-only">Search posts</span>
          <input
            className="border-input bg-background h-9 w-full rounded-md border pr-3 pl-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title or author"
            type="search"
            value={query}
          />
        </label>
        <div
          className="flex items-center gap-1 overflow-x-auto"
          role="group"
          aria-label="Filter by status"
        >
          {filters.map((filter) => (
            <Button
              key={filter}
              onClick={() => setStatus(filter)}
              size="sm"
              variant={status === filter ? "secondary" : "ghost"}
            >
              {filter}
            </Button>
          ))}
          <Button aria-label="More filters" size="icon" variant="outline">
            <Filter aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[840px] text-left text-sm">
          <thead className="bg-muted/60 text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-5 py-3 font-medium">Post</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Performance</th>
              <th className="w-12 px-3 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {visiblePosts.map((post) => (
              <tr className="hover:bg-muted/30" key={post.slug}>
                <td className="px-5 py-4">
                  <Link
                    className="flex items-center gap-3"
                    href={`/posts/${post.slug}/`}
                  >
                    <span className="relative block h-14 w-20 shrink-0 overflow-hidden rounded-md">
                      <Image
                        alt=""
                        className="object-cover"
                        fill
                        sizes="80px"
                        src={post.image}
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block max-w-md truncate font-medium">
                        {post.title}
                      </span>
                      <span className="text-muted-foreground mt-1 block text-xs">
                        {post.category} · {post.readTime} · {post.author}
                      </span>
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge label={post.status} />
                </td>
                <td className="text-muted-foreground px-4 py-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays aria-hidden="true" className="size-3.5" />
                    {post.publishedAt}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Eye
                      aria-hidden="true"
                      className="text-muted-foreground size-3.5"
                    />
                    {formatCompactNumber(post.views)}
                  </span>
                </td>
                <td className="px-3 py-4">
                  <Button
                    aria-label={`Actions for ${post.title}`}
                    size="icon"
                    variant="ghost"
                  >
                    <MoreHorizontal aria-hidden="true" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visiblePosts.length === 0 && (
        <div className="flex min-h-52 flex-col items-center justify-center px-6 text-center">
          <Search className="text-muted-foreground mb-3 size-6" />
          <p className="font-medium">No posts match this view</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Try another search or status filter.
          </p>
        </div>
      )}
      <div className="text-muted-foreground flex items-center justify-between border-t px-5 py-3 text-xs">
        <span>
          {visiblePosts.length} of {props.posts.length} posts
        </span>
        <span>Page 1 of 1</span>
      </div>
    </section>
  );
}
