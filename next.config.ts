import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true
};

export default nextConfig;
