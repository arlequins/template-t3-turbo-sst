import { Permission } from "@acme/auth/authorization";
import type { Metadata } from "next";
import { Suspense } from "react";
import { AccessBoundary } from "~/components/authorization/access-boundary";
import { PostEditor } from "~/components/blog/post-editor";

export const metadata: Metadata = { title: "Editor" };

export default function EditorPage() {
  return (
    <AccessBoundary permission={Permission.POST_WRITE} title="Content studio">
      <Suspense>
        <PostEditor />
      </Suspense>
    </AccessBoundary>
  );
}
