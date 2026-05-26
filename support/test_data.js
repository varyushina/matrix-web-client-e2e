export function create_message_text() {
  const timestamp = new Date().toISOString();
  const random_suffix = Math.random().toString(36).slice(2, 10);

  return `qa-playwright-message ${timestamp} ${random_suffix}`;
}
