import type { ContentListInput } from "../../domain/content";
import { ResourceNotFoundError } from "../errors";
import type { ApplicationLogger } from "../ports/application-logger";
import type { ContentRepository } from "../ports/content-repository";

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

export function createContentService(deps: {
  logger: ApplicationLogger;
  repository: ContentRepository;
}) {
  return {
    listContent(input: ContentListInput = {}) {
      const normalized: Required<ContentListInput> = {
        direction: input.direction ?? "desc",
        page: Math.max(1, input.page ?? 1),
        pageSize: Math.min(
          MAX_PAGE_SIZE,
          Math.max(1, input.pageSize ?? DEFAULT_PAGE_SIZE),
        ),
        query: input.query?.trim() ?? "",
        sort: input.sort ?? "createdAt",
      };
      deps.logger.debug("content.list", normalized);
      return deps.repository.list(normalized);
    },

    async getContentById(id: string) {
      deps.logger.debug("content.get", { contentId: id });
      const content = await deps.repository.findById(id);
      if (!content) throw new ResourceNotFoundError("Content item not found");
      return content;
    },

    createContent(input: { content: string; title: string }) {
      deps.logger.info("content.create");
      return deps.repository.create(input);
    },

    async updateContent(id: string, input: { content: string; title: string }) {
      deps.logger.info("content.update", { contentId: id });
      const content = await deps.repository.update(id, input);
      if (!content) throw new ResourceNotFoundError("Content item not found");
      return content;
    },

    async deleteContent(id: string) {
      deps.logger.info("content.delete", { contentId: id });
      const deleted = await deps.repository.delete(id);
      if (!deleted) throw new ResourceNotFoundError("Content item not found");
      return { deleted: true } as const;
    },
  };
}

export type ContentService = ReturnType<typeof createContentService>;
