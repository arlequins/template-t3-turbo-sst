import { expect, test } from "@playwright/test";

test("signs in with PKCE, reaches the protected API, and signs out", async ({
  page,
  request,
}, testInfo) => {
  const postTitle = `E2E post ${testInfo.project.name}`;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5100";
  const readiness = await request.get(`${apiUrl}/health/ready`);
  expect(readiness.status()).toBe(200);
  await expect(readiness.json()).resolves.toMatchObject({
    checks: { database: "ok" },
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.getByPlaceholder("Enter any login").fill("local-user");
  await page.getByPlaceholder("and password").fill("local-password");
  await page.getByRole("button", { name: "Sign-in" }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page).toHaveURL("http://localhost:3100/");
  await expect(page.getByTestId("api-session")).toHaveText(
    "API session: Local Test User",
  );

  await page.getByRole("textbox", { name: "Bug Title" }).fill(postTitle);
  await page.getByRole("textbox", { name: "Content" }).fill("Created by E2E");
  await page.getByRole("button", { name: "Create" }).click();
  const createdPost = page.getByRole("heading", { name: postTitle });
  await expect(createdPost).toBeVisible();
  await createdPost
    .locator("../..")
    .getByRole("button", { name: "Delete" })
    .click();
  await expect(createdPost).not.toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL("http://localhost:3100/");
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
});
