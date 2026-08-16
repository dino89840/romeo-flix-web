interface CloudflareEnv {
  DB: D1Database;
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
  AUTH_SECRET: string;
  MEDIA_SIGNING_SECRET: string;
  MEDIA_HOSTS: string;
  ASSETS: Fetcher;
}
