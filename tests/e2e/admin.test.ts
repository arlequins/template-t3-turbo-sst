import { expect, test } from "@playwright/test";

async function completeOidcSignIn(
  page: import("@playwright/test").Page,
  login: string,
) {
  await page.getByPlaceholder("Enter any login").fill(login);
  await page.getByPlaceholder("and password").fill("local-password");
  await page.getByRole("button", { name: "Sign-in" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
}

test("protects administration and provisions a bootstrap administrator", async ({
  page,
}) => {
  await page.goto("/admin/");
  await expect(
    page.getByRole("button", { name: "Sign in to continue" }),
  ).toBeVisible();

  await page.goto("/login/");
  await expect(
    page.getByRole("heading", { name: "Administration sign in" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Continue with OpenID Connect" })
    .click();
  await completeOidcSignIn(page, "local-admin");

  await expect(page).toHaveURL("http://localhost:3100/admin/");
  await expect(
    page.getByRole("heading", { name: "Administration", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Administrator session")).toBeVisible();

  await page.goto("/users/");
  await expect(
    page.getByRole("heading", { name: "User management" }),
  ).toBeVisible();
  await expect(page.getByText("local-admin@example.test")).toBeVisible();
  await expect(
    page
      .getByRole("article")
      .filter({ hasText: "local-admin@example.test" })
      .getByLabel("Application role"),
  ).toHaveValue("admin");

  await page.goto("/editor/");
  await expect(
    page.getByRole("heading", { name: "Content studio" }),
  ).toBeVisible();
  await expect(page.getByLabel("Category")).toHaveValue("notes");
  await expect(page.getByRole("button", { name: "Export MDX" })).toBeDisabled();
});
