import { describe, expect, it, vi } from "vitest";

import type { ApplicationLogger, PostRepository } from "./post";
import { createPostService } from "./post";

function createDependencies() {
  const repository: PostRepository = {
    create: vi.fn(),
    delete: vi.fn(),
    findById: vi.fn(),
    list: vi
      .fn()
      .mockResolvedValue({ items: [], page: 1, pageSize: 10, total: 0 }),
    update: vi.fn(),
  };
  const logger: ApplicationLogger = { debug: vi.fn(), info: vi.fn() };
  return { logger, repository };
}

describe("createPostService", () => {
  it("normalizes list input before calling the repository port", async () => {
    const deps = createDependencies();
    await createPostService(deps).listPosts({
      page: 0,
      pageSize: 100,
      query: "  term  ",
    });
    expect(deps.repository.list).toHaveBeenCalledWith({
      direction: "desc",
      page: 1,
      pageSize: 50,
      query: "term",
      sort: "createdAt",
    });
  });

  it("delegates mutations without exposing an infrastructure type", async () => {
    const deps = createDependencies();
    vi.mocked(deps.repository.update).mockResolvedValue({
      content: "Body",
      createdAt: new Date(0),
      id: "post-1",
      title: "Title",
      updatedAt: new Date(1),
    });
    vi.mocked(deps.repository.delete).mockResolvedValue(true);
    const service = createPostService(deps);
    await service.updatePost("post-1", { content: "Body", title: "Title" });
    await service.deletePost("post-1");
    expect(deps.repository.update).toHaveBeenCalledWith("post-1", {
      content: "Body",
      title: "Title",
    });
    expect(deps.repository.delete).toHaveBeenCalledWith("post-1");
  });

  it("reports missing resources through an application error", async () => {
    const deps = createDependencies();
    const service = createPostService(deps);
    await expect(service.getPostById("missing")).rejects.toThrow(
      "Content item not found",
    );
    await expect(service.deletePost("missing")).rejects.toThrow(
      "Content item not found",
    );
  });
});
