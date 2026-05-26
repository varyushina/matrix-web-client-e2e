export function get_required_env(env_name) {
  const env_value = process.env[env_name];

  if (!env_value) {
    throw new Error(`Missing required environment variable: ${env_name}. See README.md for setup.`);
  }

  return env_value;
}

export function get_optional_env(env_name, default_value = '') {
  return process.env[env_name] ?? default_value;
}
