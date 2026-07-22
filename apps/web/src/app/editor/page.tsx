import type { Metadata } from "next";
import { PostEditor } from "~/components/blog/post-editor";

export const metadata: Metadata = { title: "Editor" };

export default function EditorPage() {
  return <PostEditor />;
}
