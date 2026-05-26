import { expect } from '@playwright/test';
import { selectors } from '../support/selectors.js';

function escape_regexp(raw_text) {
  return raw_text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function read_editable_text(editable_locator) {
  return editable_locator.evaluate((element) => {
    if ('value' in element) {
      return element.value;
    }

    return element.textContent ?? '';
  });
}

export class MessagePage {
  constructor(page) {
    this.page = page;
    this.room_timeline = page.locator(selectors.room_timeline);
    this.message_composer = page.locator(selectors.message_composer);
    this.send_message_button = page.locator(selectors.send_message_button);
  }

  get_message_text(message_text) {
    const exact_message_text = new RegExp(`^${escape_regexp(message_text)}$`);

    return this.room_timeline.locator(selectors.message_text).filter({ hasText: exact_message_text });
  }

  get_message_container(message_text) {
    const exact_message_text = new RegExp(`^${escape_regexp(message_text)}$`);
    const matching_message_text = this.page.locator(selectors.message_text).filter({
      hasText: exact_message_text
    });

    return this.room_timeline.locator(selectors.timeline_message).filter({ has: matching_message_text });
  }

  async expect_ready_to_send() {
    await expect(this.room_timeline).toBeVisible();
    await expect(this.message_composer).toBeVisible();
    await expect(this.message_composer).toBeEditable();
    await expect(this.send_message_button).toBeVisible();
  }

  async send_text_message(message_text) {
    await this.message_composer.fill(message_text);

    await expect.poll(
      async () => read_editable_text(this.message_composer),
      { message: 'Message composer should contain the text before sending.' }
    ).toBe(message_text);

    await expect(this.send_message_button).toBeEnabled();
    await this.send_message_button.click();

    await expect.poll(
      async () => read_editable_text(this.message_composer),
      { message: 'Message composer should be empty after the message is sent.' }
    ).toBe('');
  }

  async expect_message_visible_to_user(message_text) {
    const sent_message_text = this.get_message_text(message_text);

    await expect(sent_message_text).toHaveCount(1);
    await expect(sent_message_text).toBeVisible();
    await expect(sent_message_text).toBeInViewport();
  }

  async expect_message_without_send_error(message_text) {
    const sent_message = this.get_message_container(message_text);
    const send_error = sent_message.locator(selectors.message_send_error);

    await expect(sent_message).toHaveCount(1);
    await expect(send_error).not.toBeVisible();
  }
}
