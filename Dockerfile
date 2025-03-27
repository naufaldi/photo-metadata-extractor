# Build stage
FROM oven/bun:1 AS builder
WORKDIR /app

# Add these lines here, before the build step
ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY

COPY package*.json ./
RUN bun install
COPY . .
RUN bun run build

# Production stage
FROM oven/bun:1-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "server.js"]