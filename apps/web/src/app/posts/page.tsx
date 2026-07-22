import { Button } from "@acme/ui/button";
import { PenLine } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "~/components/blog/page-header";
import { PostListView } from "~/components/blog/post-list-view";
import { blogPosts } from "~/lib/blog-data";

export const metadata: Metadata = { title: "Posts" };

export default function PostsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Posts"
        description="Write, review, schedule, and measure everything your publication shares."
        actions={
          <Button asChild>
            <Link href="/editor/">
              <PenLine aria-hidden="true" />
              New post
            </Link>
          </Button>
        }
      />
      <PostListView posts={blogPosts} />
    </div>
  );
}
