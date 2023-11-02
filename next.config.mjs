/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");
import nextIntlPLugin from "next-intl/plugin";
const withNextIntl = nextIntlPLugin(
  // This is the default (also the `src` folder is supported out of the box)
  "./src/i18n/server.ts",
);

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    typedRoutes: true,
  },
};

export default withNextIntl(config);
