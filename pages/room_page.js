import { expect } from '@playwright/test';
import { selectors, to_css_attribute_value } from '../support/selectors.js';

export class RoomPage {
  constructor(page) {
    this.page = page;
    this.authenticated_shell = page.locator(selectors.authenticated_shell);
    this.room_list = page.locator(selectors.room_list);
    this.room_timeline = page.locator(selectors.room_timeline);
  }

  async expect_logged_in() {
    await expect(this.authenticated_shell).toBeVisible();
  }

  async open_existing_room(room_id) {
    const escaped_room_id = to_css_attribute_value(room_id);
    const room_list_item = this.page.locator(
      `${selectors.room_list_item}[data-qa-verified-room-id=${escaped_room_id}]`
    );
    const room_header = this.page.locator(
      `${selectors.room_header}[data-qa-verified-room-id=${escaped_room_id}]`
    );

    await expect(this.room_list).toBeVisible();
    await expect(room_list_item).toBeVisible();
    await room_list_item.click();

    await expect(room_header).toBeVisible();
    await expect(this.room_timeline).toBeVisible();
  }
}
