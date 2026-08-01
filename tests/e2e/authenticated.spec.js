const { test, expect } = require("@playwright/test");
const { loadAuthEnv } = require("./utils/env");

const auth = loadAuthEnv();

async function openNewCollection(page) {
  await page.getByRole("button", { name: "New collection" }).click();
  await expect(page).toHaveURL(/\/collection\//);
}

async function waitForClient(page) {
  await expect
    .poll(
      async () => {
        return page.evaluate(() => {
          const rootEl = document.getElementById("root");
          if (!rootEl) return false;
          const fiberKey = Object.keys(rootEl).find((k) =>
            k.startsWith("__reactContainer$"),
          );
          if (!fiberKey) return false;

          const queue = [rootEl[fiberKey]];
          while (queue.length > 0) {
            const node = queue.shift();
            if (node.memoizedState) {
              let s = node.memoizedState;
              while (s) {
                if (
                  s.memoizedState &&
                  typeof s.memoizedState === "object" &&
                  (s.memoizedState._connected !== undefined ||
                    s.memoizedState.invoke !== undefined)
                ) {
                  return true;
                }
                s = s.next;
              }
            }
            if (node.child) queue.push(node.child);
            if (node.sibling) queue.push(node.sibling);
          }
          return false;
        });
      },
      { timeout: 30000 },
    )
    .toBe(true);
}

async function addChannelsToCollection(page, channels) {
  const input = page.getByPlaceholder(
    "Insert channel handles here, separated with comma",
  );
  const submitButton = page.locator('form button[type="submit"]').first();
  const handles = channels.join(",");
  const expected = `${channels.length} channels`;

  await expect(input).toBeEnabled({ timeout: 30000 });
  await expect(submitButton).toBeEnabled({ timeout: 30000 });

  await waitForClient(page);

  await input.fill(handles);
  await expect(input).toHaveValue(handles);
  await submitButton.click();

  await expect(page.getByText(expected)).toBeVisible({ timeout: 30000 });
}

async function startCollection(page, jobName) {
  const firstChannelRow = page.locator("tbody tr").first();
  await firstChannelRow.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Collect messages" }).click();

  await page
    .getByLabel("Job name (name for the collection task)")
    .fill(jobName);
  await page.getByRole("button", { name: "Select all" }).click();
  await page.getByRole("button", { name: "Start collecting" }).click();
}

test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ page }) => {
  test.skip(
    !auth.ready,
    `Missing env vars: ${auth.missing.join(", ")}. Create .env.test.local (or .env) using .env.test.example and fill values.`,
  );

  await page.goto("/");
  await expect(page.getByText("Logged in as")).toBeVisible();
  // Allow time for Telegram client to establish connection in ClientProvider
  await page.waitForTimeout(3000);
});

test("see folder appears", async ({ page }) => {
  test.skip(!auth.folderName, "Set TG_E2E_FOLDER_NAME for folder assertion.");

  const sidebar = page.locator("nav");

  await expect(
    sidebar.getByText("Telegram folders", { exact: true }),
  ).toBeVisible();
  await expect(
    sidebar.getByRole("link", { name: auth.folderName }),
  ).toBeVisible({
    timeout: 30000,
  });
});

test("navigate folder view", async ({ page }) => {
  test.skip(!auth.folderName, "Set TG_E2E_FOLDER_NAME for folder assertion.");

  const sidebar = page.locator("nav");
  await expect(
    sidebar.getByRole("link", { name: auth.folderName }),
  ).toBeVisible({ timeout: 30000 });
  await sidebar.getByRole("link", { name: auth.folderName }).click();
  await expect(page).toHaveURL(/\/folder\/f/);
  await expect(
    page.getByRole("heading", { name: auth.folderName }),
  ).toBeVisible();
});

test("toggle phone visibility", async ({ page }) => {
  const accountCard = page.locator("nav");
  await expect(accountCard.getByText("Logged in as")).toBeVisible();
  const toggleBtn = accountCard.getByRole("button", {
    name: "Show phone number",
  });
  await toggleBtn.click();
  await expect(accountCard.getByText(/Phone:/)).toBeVisible();
  await toggleBtn.click();
});

test("toggle theme mode", async ({ page }) => {
  const themeSwitch = page.locator("header .mantine-Switch-root");
  await themeSwitch.click();
  await themeSwitch.click();
});

test("terms of use page", async ({ page }) => {
  await page.goto("/terms");
  await expect(
    page.getByRole("heading", { name: "Terms of Use" }),
  ).toBeVisible();
});

test("add channels and rename collection", async ({ page }) => {
  await openNewCollection(page);
  await addChannelsToCollection(page, auth.channels);

  const heading = page.locator("h1");
  await heading.click();
  const titleInput = page.locator("form input").first();
  await titleInput.fill("Renamed Test Collection");
  await titleInput.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Renamed Test Collection" }),
  ).toBeVisible();
});

test("collect messages and manage collection job lifecycle", async ({
  page,
}) => {
  await openNewCollection(page);
  await addChannelsToCollection(page, auth.channels);

  let jobRow;

  await test.step("1. Start message collection job", async () => {
    await startCollection(page, auth.jobName);
  });

  await test.step("2. Test active job pause and resume", async () => {
    await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible({
      timeout: 30000,
    });
    const cancelButton = page.locator("nav").getByRole("button", {
      name: "Cancel",
    });
    const pauseButton = cancelButton.locator("xpath=following-sibling::button");

    await pauseButton.click();
    await pauseButton.click();
  });

  await test.step("3. Verify job completion and record count", async () => {
    await page.getByRole("tab", { name: "Collected messages" }).click();
    jobRow = page.locator("tr", { hasText: auth.jobName });
    await expect(jobRow).toBeVisible({ timeout: 120000 });
    await expect(jobRow).toContainText("success", { timeout: 120000 });
    await expect(jobRow).toContainText(/[1-9]/);
  });

  await test.step("4. Export JSON sanity", async () => {
    const row = page.locator("tr", { hasText: auth.jobName }).first();
    await row.getByPlaceholder("Format").click();
    await page.getByRole("option", { name: "JSON" }).click();

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      row.locator("button").nth(1).click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.json$/i);
  });

  await test.step("5. Export CSV sanity", async () => {
    const row = page.locator("tr", { hasText: auth.jobName }).first();
    await row.getByPlaceholder("Format").click();
    await page.getByRole("option", { name: "CSV" }).click();

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      row.locator("button").nth(1).click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.csv$/i);
  });

  await test.step("6. Delete completed job record", async () => {
    const deleteBtn = jobRow.locator("button").last();
    await deleteBtn.click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(jobRow).not.toBeVisible();
  });
});

test("delete channel and collection", async ({ page }) => {
  await openNewCollection(page);
  await addChannelsToCollection(page, auth.channels);

  // Delete channel
  const row = page.locator("tbody tr").first();
  await row.locator("button").last().click();
  await expect(
    page.getByText(
      "No channel added yet. Login to your Telegram account and add some new channels above.",
    ),
  ).toBeVisible({ timeout: 30000 });

  // Delete collection
  const deleteBtn = page.locator("main button").nth(1);
  await deleteBtn.click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page).toHaveURL("http://localhost:4173/");
});

test("session restore after reload", async ({ page }) => {
  await openNewCollection(page);
  await page.reload();

  await expect(page.getByText("Logged in as")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "New collection" }),
  ).toBeVisible();
});

test("logout", async ({ page }) => {
  test.skip(
    process.env.TG_E2E_VERIFY_LOGOUT !== "1",
    "Remote logout invalidates the saved Telegram session. Run explicitly with TG_E2E_VERIFY_LOGOUT=1.",
  );

  await page.locator("nav").getByRole("button").last().click();
  await page.getByRole("button", { name: "Log out" }).click();
  await expect(
    page.getByRole("button", { name: "Login to Telegram" }),
  ).toBeVisible({
    timeout: 30000,
  });
});
