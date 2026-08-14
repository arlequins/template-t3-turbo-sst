import { z } from "zod/v4";

export const contentCategorySchema = z.enum(["design", "engineering", "notes"]);
export const contentLocaleSchema = z.enum(["en", "ja", "ko"]);
export const contentStatusSchema = z.enum(["approved", "draft", "in-review"]);

/** Shared with API `post.create` input — keep in sync with DB constraints */
export const createPostInputSchema = z
  .object({
    category: contentCategorySchema,
    content: z.string().trim().min(1).max(10_000),
    description: z.string().trim().min(20).max(240),
    featured: z.boolean(),
    image: z.string().trim().startsWith("/"),
    imageAlt: z.string().trim().min(1).max(240),
    locale: contentLocaleSchema,
    publishedAt: z.coerce.date().nullable(),
    slug: z
      .string()
      .trim()
      .min(1)
      .max(256)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    status: contentStatusSchema,
    title: z.string().trim().min(1).max(256),
    translationKey: z
      .string()
      .trim()
      .min(1)
      .max(256)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  })
  .superRefine((input, context) => {
    if (input.status === "approved" && !input.publishedAt) {
      context.addIssue({
        code: "custom",
        message: "Approved content requires a publish date",
        path: ["publishedAt"],
      });
    }
  });

export type CreatePostInput = z.infer<typeof createPostInputSchema>;

export const updatePostInputSchema = z.object({
  id: z.uuid(),
  data: createPostInputSchema.extend({ version: z.number().int().positive() }),
});

export const listPostsInputSchema = z.object({
  direction: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().min(1).max(50).default(10),
  query: z.string().max(256).default(""),
  sort: z.enum(["createdAt", "title"]).default("createdAt"),
  status: contentStatusSchema.optional(),
  locale: contentLocaleSchema.optional(),
});

export type ListPostsInput = z.infer<typeof listPostsInputSchema>;
export type UpdatePostInput = z.infer<typeof updatePostInputSchema>;
