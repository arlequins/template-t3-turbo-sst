import { describe, expect, it } from "vitest";

import { createLocalizedMetadata } from "./seo";

describe("createLocalizedMetadata", () => {
  it("creates canonical and hreflang URLs for every locale", () => {
    const metadata = createLocalizedMetadata({
      description: "Localized article description",
      image: "/blog/editorial-workspace.jpg",
      locale: "ko",
      path: "posts/build-calm-systems",
      title: "Localized article",
    });

    expect(metadata.alternates?.canonical?.toString()).toContain(
      "/ko/posts/build-calm-systems/",
    );
    expect(metadata.alternates?.languages).toMatchObject({
      en: expect.stringContaining("/en/posts/build-calm-systems/"),
      ja: expect.stringContaining("/ja/posts/build-calm-systems/"),
      ko: expect.stringContaining("/ko/posts/build-calm-systems/"),
    });
  });
});
