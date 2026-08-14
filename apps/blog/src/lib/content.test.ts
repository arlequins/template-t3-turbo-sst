import { describe, expect, it } from "vitest";

import { parsePostFile, validateTranslationCoverage } from "./content";

const frontmatter = `---
title: "A valid title"
description: "A sufficiently detailed description for validation."
category: "engineering"
reviewStatus: "approved"
publishedAt: "2026-07-10"
image: "/blog/example.jpg"
imageAlt: "A descriptive alternative"
featured: true
translationKey: "valid-post"
---

# Valid content
`;

describe("localized MDX content", () => {
  it("parses schema-valid frontmatter from the filename contract", () => {
    const post = parsePostFile("valid-post.en.mdx", frontmatter);

    expect(post).toMatchObject({
      locale: "en",
      slug: "valid-post",
      title: "A valid title",
    });
  });

  it("rejects invalid categories before build", () => {
    expect(() =>
      parsePostFile(
        "valid-post.en.mdx",
        frontmatter.replace('category: "engineering"', 'category: "typo"'),
      ),
    ).toThrow();
  });

  it("reports missing translations", () => {
    const post = parsePostFile("valid-post.en.mdx", frontmatter);

    expect(() => validateTranslationCoverage([post])).toThrow(
      "missing translations for ko, ja",
    );
  });
});
