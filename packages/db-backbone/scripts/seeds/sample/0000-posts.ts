import { assertSampleSeedAllowed } from "@acme/shared/seed-safety";
import type { SeedContext } from "@acme/types";

import type { Database } from "../../../src/client";
import { Post } from "../../../src/schema";

type SeedTx = Parameters<Parameters<Database["transaction"]>[0]>[0];

export default async function seed({
  tx,
  stage,
}: SeedContext<SeedTx>): Promise<void> {
  assertSampleSeedAllowed(stage, true);
  await tx.insert(Post).values([
    {
      category: "engineering",
      content: "Hello from the sample content seed.",
      description: "A sample entry for validating local content workflows.",
      imageAlt: "A sample editorial workspace",
      slug: "seeded-post",
      title: "Seeded post",
      translationKey: "seeded-post",
    },
    {
      content: "Add more rows here as the template grows.",
      description: "A second sample entry for list and pagination checks.",
      imageAlt: "A second sample editorial workspace",
      slug: "second-seed",
      title: "Second seed",
      translationKey: "second-seed",
    },
  ]);
}
