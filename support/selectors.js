export const selectors = Object.freeze({
  authenticated_shell: '[data-qa-verified-authenticated-shell]',
  login_form: '[data-qa-verified-login-form]',
  message_composer: '[data-qa-verified-message-composer]',
  message_send_error: '[data-qa-verified-message-send-error]',
  message_text: '[data-qa-verified-message-text]',
  password_input: '[data-qa-verified-login-password]',
  room_header: '[data-qa-verified-room-header]',
  room_list: '[data-qa-verified-room-list]',
  room_list_item: '[data-qa-verified-room-list-item]',
  room_timeline: '[data-qa-verified-room-timeline]',
  send_message_button: '[data-qa-verified-send-message-button]',
  submit_button: '[data-qa-verified-login-submit]',
  timeline_message: '[data-qa-verified-timeline-message]',
  user_name_input: '[data-qa-verified-login-username]'
});

export function to_css_attribute_value(raw_value) {
  return JSON.stringify(raw_value);
}
