# ---- Stage 1: install dependencies (builds the native sqlite3 binary) ----
FROM node:22-bookworm-slim AS deps
WORKDIR /app

# Build tools, used only if a prebuilt sqlite3 binary isn't available for the
# target architecture (e.g. when building on ARM / Raspberry Pi).
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---- Stage 2: runtime ----
FROM node:22-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app

# node_modules comes from the build stage (Linux binaries); .dockerignore keeps
# the host's node_modules out of the build context so it can't clobber them.
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Holds the SQLite database (reviews.sqlite) and auth.json — mount a volume here.
RUN mkdir -p /app/data

EXPOSE 3000
CMD ["node", "server.js"]
