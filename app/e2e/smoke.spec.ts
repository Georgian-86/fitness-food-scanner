import { expect, test, type Page } from '@playwright/test';
import { ANCHOR_BARCODE } from '../src/data/fixtures';

const UNKNOWN_BARCODE = '8909999999994'; // valid EAN-13, not in fixtures

test.beforeEach(async ({ page }) => {
  // Open Food Facts is blocked: the app must work from fixtures and manual entry.
  await page.route('**/*openfoodfacts.org/**', (r) => r.abort());
});

async function onboard(page: Page) {
  await page.goto('./');
  await expect(page).toHaveURL(/#\/onboarding/);
  await page.getByTestId('goal-fat_loss').click();
  await expect(page.getByTestId('goal-fat_loss')).toHaveAttribute('aria-checked', 'true');
  await page.getByTestId('onboarding-save').click();
  await expect(page.getByTestId('barcode-input')).toBeVisible();
}

async function enterBarcode(page: Page, code: string) {
  await page.goto('./#/');
  await page.getByTestId('barcode-input').fill(code);
  await page.getByTestId('barcode-submit').click();
}

test('scan flow: fixture verdict, goal switch, manual entry, history', async ({ page }) => {
  await test.step('1. onboard with fat loss', async () => {
    await onboard(page);
  });

  await test.step('2. anchor product is orange for fat loss', async () => {
    await enterBarcode(page, ANCHOR_BARCODE);
    const card = page.getByTestId('verdict-card');
    await expect(card).toBeVisible();
    await expect(page.getByTestId('source-label')).toContainText('demo');
    await expect.soft(card).toHaveAttribute('data-colour', 'orange');
    await expect.soft(page.getByTestId('verdict-reason')).not.toBeEmpty();
  });

  await test.step('3. switch to muscle gain in Settings: anchor is green', async () => {
    await page.getByTestId('nav-settings').click();
    await page.getByTestId('goal-muscle_gain').click();
    await expect(page.getByTestId('goal-muscle_gain')).toHaveAttribute('aria-checked', 'true');
    await page.reload(); // settings persist across reloads
    await expect(page.getByTestId('goal-muscle_gain')).toHaveAttribute('aria-checked', 'true');
    await page.goto(`./#/product/${ANCHOR_BARCODE}`);
    const card = page.getByTestId('verdict-card');
    await expect(card).toBeVisible();
    await expect.soft(card).toHaveAttribute('data-colour', 'green');
    await expect.soft(page.getByTestId('verdict-reason')).not.toBeEmpty();
  });

  await test.step('4. unknown barcode -> manual form -> saved -> in history', async () => {
    await enterBarcode(page, UNKNOWN_BARCODE);
    const form = page.getByTestId('manual-form');
    await expect(form).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`#/manual/${UNKNOWN_BARCODE}`));
    await page.getByTestId('manual-name').fill('Masala Oats Test Pack');
    await page.getByTestId('manual-brand').fill('TestBrand');
    await page.getByTestId('manual-energyKcal').fill('380');
    await page.getByTestId('manual-proteinG').fill('12');
    await page.getByTestId('manual-sugarG').fill('4');
    await page.getByTestId('manual-satFatG').fill('2');
    await page.getByTestId('manual-saltG').fill('1.2');
    await page.getByTestId('manual-servingSizeG').fill('40');
    await page.getByTestId('manual-diet-veg').click();
    await page.getByTestId('manual-save').click();

    await expect(page).toHaveURL(new RegExp(`#/product/${UNKNOWN_BARCODE}`));
    await expect(page.getByTestId('verdict-card')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Masala Oats Test Pack');
    await expect(page.getByTestId('source-label')).toContainText('Entered by you');

    await page.getByTestId('nav-history').click();
    const items = page.getByTestId('history-item');
    await expect(items.filter({ hasText: 'Masala Oats Test Pack' })).toHaveCount(1);
    await expect(items.first()).toContainText('Masala Oats Test Pack'); // most recent first

    // saved product survives a reload and is found without the manual form
    await page.reload();
    await enterBarcode(page, UNKNOWN_BARCODE);
    await expect(page.getByTestId('verdict-card')).toBeVisible();
  });
});

test('5. games placeholder renders', async ({ page }) => {
  await onboard(page);
  await page.goto('./#/games');
  await expect(page.getByTestId('games-page')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Mini-games coming soon' })).toBeVisible();
});

test('no camera: manual entry stays usable', async ({ page }) => {
  await onboard(page);
  await page.getByTestId('scan-button').click();
  // Headless Chromium has no camera permission granted here: a friendly message shows instead.
  await expect(page.getByTestId('camera-problem')).toBeVisible({ timeout: 10_000 });
  await expect(page.getByTestId('barcode-input')).toBeVisible();
  await expect(page.locator('body')).not.toContainText(/dangerous/i);
});
