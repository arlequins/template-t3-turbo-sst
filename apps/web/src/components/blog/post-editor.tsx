"use client";

import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import { toast } from "@acme/ui/toast";
import { Eye, Save, Send } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function PostEditor() {
  const [preview, setPreview] = useState(false);
  const [title, setTitle] = useState(
    "The quiet craft of building useful things",
  );
  const [excerpt, setExcerpt] = useState(
    "Notes on clarity, restraint, and designing work that earns a place in someone's day.",
  );
  const [body, setBody] = useState(
    "Good tools begin with a close reading of the work already happening. They make important choices visible, preserve context, and create enough calm for people to focus.\n\nThe craft is not in adding every possible feature. It is in deciding what deserves attention and making that path feel natural.",
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-xs">Saved a moment ago</p>
          <h1 className="mt-1 text-xl font-semibold">Post editor</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setPreview((value) => !value)}
            variant="outline"
          >
            <Eye />
            {preview ? "Continue editing" : "Preview"}
          </Button>
          <Button
            onClick={() => toast.success("Draft saved")}
            variant="outline"
          >
            <Save />
            Save draft
          </Button>
          <Button onClick={() => toast.success("Post published")}>
            <Send />
            Publish
          </Button>
        </div>
      </div>
      {preview ? (
        <article className="bg-background overflow-hidden rounded-lg border">
          <div className="relative aspect-[16/7] min-h-56">
            <Image
              alt="Workspace with a notebook and laptop"
              className="object-cover"
              fill
              sizes="100vw"
              src="/blog/editorial-workspace.jpg"
            />
          </div>
          <div className="mx-auto max-w-3xl px-6 py-10">
            <p className="text-primary text-sm font-medium">Work</p>
            <h2 className="mt-3 text-3xl font-semibold">
              {title || "Untitled post"}
            </h2>
            <p className="text-muted-foreground mt-4 text-lg leading-8">
              {excerpt}
            </p>
            <div className="mt-8 space-y-5 leading-8">
              {body.split("\n\n").map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </article>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <section className="bg-background space-y-5 rounded-lg border p-5 sm:p-7">
            <label className="block text-sm font-medium" htmlFor="post-title">
              Title
              <Input
                className="mt-2 h-11 text-lg"
                id="post-title"
                onChange={(event) => setTitle(event.target.value)}
                value={title}
              />
            </label>
            <label className="block text-sm font-medium">
              Excerpt
              <textarea
                className="bg-background mt-2 min-h-24 w-full rounded-md border p-3 text-sm"
                onChange={(event) => setExcerpt(event.target.value)}
                value={excerpt}
              />
            </label>
            <label className="block text-sm font-medium">
              Body
              <textarea
                className="bg-background mt-2 min-h-80 w-full rounded-md border p-4 font-serif text-base leading-7"
                onChange={(event) => setBody(event.target.value)}
                value={body}
              />
            </label>
          </section>
          <aside className="bg-background h-fit rounded-lg border p-5">
            <h2 className="text-sm font-semibold">Post settings</h2>
            <div className="mt-5 space-y-4">
              <label className="block text-sm font-medium">
                Category
                <select className="bg-background mt-2 h-9 w-full rounded-md border px-3">
                  <option>Work</option>
                  <option>Design</option>
                  <option>Culture</option>
                  <option>Ideas</option>
                </select>
              </label>
              <label className="block text-sm font-medium">
                Author
                <select className="bg-background mt-2 h-9 w-full rounded-md border px-3">
                  <option>Maya Chen</option>
                  <option>Jon Bell</option>
                  <option>Alina Ross</option>
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input className="size-4 accent-pink-600" type="checkbox" />
                Feature on homepage
              </label>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
