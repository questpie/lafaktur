import million from "million/compiler";
import pattycake from "pattycake";
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
const config = {
  experimental: {},
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone",
};

export default withBundleAnalyzer(
  million.next(
    withNextIntl(pattycake.next(config, { disableOptionalChaining: true })),
    { auto: { rsc: true } },
  ),
);
