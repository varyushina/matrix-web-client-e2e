import { test } from '@playwright/test';
import { LoginPage } from '../pages/login_page.js';
import { MessagePage } from '../pages/message_page.js';
import { RoomPage } from '../pages/room_page.js';
import { get_optional_env, get_required_env } from '../support/env.js';
import { create_message_text } from '../support/test_data.js';

test.describe('matrix web client message delivery', () => {
  test('user sends a text message and sees it in an existing room timeline', async ({ page }) => {
    const user_name = get_required_env('E2E_USER_NAME');
    const user_password = get_required_env('E2E_USER_PASSWORD');
    const room_id = get_required_env('E2E_ROOM_ID');
    const login_path = get_optional_env('E2E_LOGIN_PATH', '/');
    const message_text = create_message_text();

    const login_page = new LoginPage(page, login_path);
    const room_page = new RoomPage(page);
    const message_page = new MessagePage(page);

    await test.step('Log in as an existing Matrix user', async () => {
      await login_page.open();
      await login_page.login_with_credentials(user_name, user_password);
      await room_page.expect_logged_in();
    });

    await test.step('Open an existing room by stable room id', async () => {
      await room_page.open_existing_room(room_id);
      await message_page.expect_ready_to_send();
    });

    await test.step('Send a unique text message', async () => {
      await message_page.send_text_message(message_text);
    });

    await test.step('Verify the message is visible to the user in the timeline', async () => {
      await message_page.expect_message_visible_to_user(message_text);
      await message_page.expect_message_without_send_error(message_text);
    });
  });
});
