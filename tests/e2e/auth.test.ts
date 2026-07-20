import { expect, test } from "@playwright/test";

test("signs in with PKCE, reaches the protected API, and signs out", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.getByPlaceholder("Enter any login").fill("local-user");
  await page.getByPlaceholder("and password").fill("local-password");
  await page.getByRole("button", { name: "Sign-in" }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page).toHaveURL("http://localhost:3100/");
  await expect(page.getByTestId("api-session")).toHaveText(
    "API session: local-user",
  );

  await page.getByRole("textbox", { name: "Bug Title" }).fill("E2E post");
  await page.getByRole("textbox", { name: "Content" }).fill("Created by E2E");
  await page.getByRole("button", { name: "Create" }).click();
  const createdPost = page.getByRole("heading", { name: "E2E post" });
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
