##### DEPENDENCIES

FROM --platform=linux/amd64 node:20-alpine3.17 AS deps
RUN apk add --no-cache libc6-compat openssl1.1-compat
WORKDIR /app

# Install dependencies based on the preferred package manager

COPY package.json pnpm-lock.yaml\* ./

RUN yarn global add pnpm && pnpm i

##### BUILDER

FROM --platform=linux/amd64 node:20-alpine3.17 AS builder
ARG DATABASE_URL
# ARG NEXT_PUBLIC_CLIENTVAR
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn global add pnpm
# if database_url is set run migrations
RUN if [ -n "$DATABASE_URL" ]; then SKIP_ENV_VALIDATION=1 pnpm migration:up; fi
RUN SKIP_ENV_VALIDATION=1 pnpm build


##### RUNNER

FROM --platform=linux/amd64 node:20-alpine3.17 AS runner
WORKDIR /app

ENV NODE_ENV production

# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
