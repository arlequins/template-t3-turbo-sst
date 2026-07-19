"use client";

import { AuthStatus } from "~/auth/status";
import { env } from "~/env";
import { CreatePostForm, PostList } from "../components/posts";

export default function HomePage() {
  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <AuthStatus />
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create <span className="text-primary">T3</span> Turbo
        </h1>
        <p className="text-muted-foreground max-w-lg text-center text-sm">
          Static Next.js for S3 + CloudFront (SST). API via{" "}
          <code className="text-xs">{env.NEXT_PUBLIC_API_URL}</code>.
        </p>

        <CreatePostForm />
        <div className="w-full max-w-2xl overflow-y-scroll">
          <PostList />
        </div>
      </div>
    </main>
  );
}
