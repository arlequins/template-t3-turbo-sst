export type PostRecord = {
  content: string;
  createdAt: Date;
  id: string;
  title: string;
  updatedAt: Date | null;
};

export type PostListInput = {
  direction?: "asc" | "desc";
  page?: number;
  pageSize?: number;
  query?: string;
  sort?: "createdAt" | "title";
};

export type PostPage = {
  items: PostRecord[];
  page: number;
  pageSize: number;
  total: number;
};

export type PostRepository = {
  create(input: { content: string; title: string }): Promise<PostRecord>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<PostRecord | undefined>;
  list(input: Required<PostListInput>): Promise<PostPage>;
  update(
    id: string,
    input: { content: string; title: string },
  ): Promise<PostRecord | undefined>;
};

export type ApplicationLogger = {
  debug(message: string, attributes?: Record<string, unknown>): void;
  info(message: string, attributes?: Record<string, unknown>): void;
};

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

export function createPostService(deps: {
  logger: ApplicationLogger;
  repository: PostRepository;
}) {
  return {
    listPosts(input: PostListInput = {}): Promise<PostPage> {
      const normalized: Required<PostListInput> = {
        direction: input.direction ?? "desc",
        page: Math.max(1, input.page ?? 1),
        pageSize: Math.min(
          MAX_PAGE_SIZE,
          Math.max(1, input.pageSize ?? DEFAULT_PAGE_SIZE),
        ),
        query: input.query?.trim() ?? "",
        sort: input.sort ?? "createdAt",
      };
      deps.logger.debug("post.list", normalized);
      return deps.repository.list(normalized);
    },

    async getPostById(id: string): Promise<PostRecord> {
      deps.logger.debug("post.get", { postId: id });
      const post = await deps.repository.findById(id);
      if (!post) throw new ResourceNotFoundError("Content item not found");
      return post;
    },

    createPost(input: { content: string; title: string }) {
      deps.logger.info("post.create");
      return deps.repository.create(input);
    },

    async updatePost(id: string, input: { content: string; title: string }) {
      deps.logger.info("post.update", { postId: id });
      const post = await deps.repository.update(id, input);
      if (!post) throw new ResourceNotFoundError("Content item not found");
      return post;
    },

    async deletePost(id: string) {
      deps.logger.info("post.delete", { postId: id });
      const deleted = await deps.repository.delete(id);
      if (!deleted) throw new ResourceNotFoundError("Content item not found");
      return { deleted: true } as const;
    },
  };
}

export type PostService = ReturnType<typeof createPostService>;

import { ResourceNotFoundError } from "./errors";
