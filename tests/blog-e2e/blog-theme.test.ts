import { expect, test } from "@playwright/test";

test("persists a selected color theme", async ({ page }) => {
  await page.goto("/en/");
  await page.getByRole("button", { name: "Use dark theme" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);

  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("keeps the same article when switching locale", async ({ page }) => {
  await page.goto("/ko/posts/build-calm-systems/");
  await page.getByRole("combobox", { name: "Language" }).selectOption("ja");

  await expect(page).toHaveURL(/\/ja\/posts\/build-calm-systems\/$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "大きな仕事を支える穏やかな仕組み",
    }),
  ).toBeVisible();
});

test("renders localized SEO links and a stable mobile layout", async ({
  page,
}) => {
  await page.goto("/en/posts/design-for-translation/");

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://your-domain.com/en/posts/design-for-translation/",
  );
  await expect(
    page.locator('link[rel="alternate"][hreflang="ko"]'),
  ).toHaveAttribute(
    "href",
    "https://your-domain.com/ko/posts/design-for-translation/",
  );
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth - dimensions.clientWidth).toBeLessThanOrEqual(
    1,
  );
});
