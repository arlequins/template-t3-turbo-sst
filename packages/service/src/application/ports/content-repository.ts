import type {
  ContentInput,
  ContentPage,
  ContentRecord,
  NormalizedContentListInput,
} from "../../domain/content";

export type ContentRepository = {
  create(input: ContentInput): Promise<ContentRecord>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<ContentRecord | undefined>;
  list(input: NormalizedContentListInput): Promise<ContentPage>;
  update(
    id: string,
    input: ContentInput,
    expectedVersion: number,
  ): Promise<
    | { status: "conflict" }
    | { status: "not-found" }
    | { status: "updated"; value: ContentRecord }
  >;
};
