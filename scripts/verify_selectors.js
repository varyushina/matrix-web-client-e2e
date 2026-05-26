import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { selectors } from '../support/selectors.js';

const checked_files = [
  'pages/login_page.js',
  'pages/message_page.js',
  'pages/room_page.js',
  'tests/messenger_message_visibility.spec.js'
];
const invalid_usages = [];
const selector_pattern = /\[[^\]]+\]/g;
const valid_selector_pattern = /^\[data-qa-verified-[\w-]+(?:=[^\]]+)?\]$/;
const checked_selectors = Object.values(selectors);
const forbidden_locator_api = 'get' + 'ByTestId';

for (const checked_file of checked_files) {
  const file_text = readFileSync(join(process.cwd(), checked_file), 'utf8');

  if (file_text.includes(forbidden_locator_api)) {
    invalid_usages.push(`${checked_file}: use locator instead of the test id helper`);
  }
}

for (const checked_selector of checked_selectors) {
  const selector_parts = checked_selector.match(selector_pattern) ?? [];

  for (const selector_part of selector_parts) {
    if (!valid_selector_pattern.test(selector_part)) {
      invalid_usages.push(`support/selectors.js: ${selector_part}`);
    }
  }
}

if (invalid_usages.length > 0) {
  throw new Error(`Found locator convention violations:\n${invalid_usages.join('\n')}`);
}

console.log('All checked locators use locator and data-qa-verified-* selectors.');
