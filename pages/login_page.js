import { expect } from '@playwright/test';
import { selectors } from '../support/selectors.js';

export class LoginPage {
  constructor(page, login_path = '/') {
    this.page = page;
    this.login_path = login_path;
    this.login_form = page.locator(selectors.login_form);
    this.user_name_input = page.locator(selectors.user_name_input);
    this.password_input = page.locator(selectors.password_input);
    this.submit_button = page.locator(selectors.submit_button);
    this.authenticated_shell = page.locator(selectors.authenticated_shell);
  }

  async open() {
    await this.page.goto(this.login_path);
    await expect(this.login_form).toBeVisible();
  }

  async login_with_credentials(user_name, user_password) {
    await expect(this.user_name_input).toBeEditable();
    await expect(this.password_input).toBeEditable();

    await this.user_name_input.fill(user_name);
    await this.password_input.fill(user_password);

    await expect(this.submit_button).toBeEnabled();
    await this.submit_button.click();

    await expect(this.authenticated_shell).toBeVisible();
  }
}
