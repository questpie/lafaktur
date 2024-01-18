import million from "million/compiler";
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");
const withNextIntl = (await import("next-intl/plugin")).default(
  // This is the default (also the `src` folder is supported out of the box)
  "./src/i18n/server.ts",
);

const withBundleAnalyzer = (await import("@next/bundle-analyzer")).default({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import("next").NextConfig} */
let config = {
  experimental: {},
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone",
};

config = withBundleAnalyzer(withNextIntl(config));
if (process.env.NODE_ENV === "production") {
  config = million.next(config, {
    auto: { rsc: true },
  });
}

export default config;
