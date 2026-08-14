import { describe, expect, it } from "vitest";

import { replacePathLocale } from "./i18n";

describe("replacePathLocale", () => {
  it("keeps the same article path while changing locale", () => {
    expect(replacePathLocale("/ko/posts/build-calm-systems/", "ja")).toBe(
      "/ja/posts/build-calm-systems/",
    );
  });
});
