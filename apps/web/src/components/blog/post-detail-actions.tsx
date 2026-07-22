"use client";

import { Button } from "@acme/ui/button";
import { toast } from "@acme/ui/toast";
import { Link as LinkIcon, PenLine } from "lucide-react";
import Link from "next/link";

export function PostDetailActions(props: { slug: string }) {
  async function copyLink() {
    await navigator.clipboard.writeText(
      `${window.location.origin}/posts/${props.slug}/`,
    );
    toast.success("Post link copied");
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={copyLink} variant="outline">
        <LinkIcon aria-hidden="true" />
        Copy link
      </Button>
      <Button asChild>
        <Link href={`/editor/?post=${props.slug}`}>
          <PenLine aria-hidden="true" />
          Edit post
        </Link>
      </Button>
    </div>
  );
}
