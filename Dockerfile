FROM node:18-bullseye-slim as base
# note: needed for prisma
RUN apt-get update && apt-get install -y openssl git
RUN npm install -g pnpm vite

# layer with all dependencies.
FROM base as deps
RUN mkdir /app
WORKDIR /app
ADD package.json pnpm-lock.yaml ./
RUN pnpm install

# production depedencies image layer.
FROM base as prod-build
RUN mkdir /app
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD package.json pnpm-lock.yaml ./
RUN pnpm install
ADD prisma .
RUN npx prisma generate
ADD . .
RUN pnpm build

# release stage.
FROM base
ENV NODE_ENV=production
WORKDIR /app
COPY --from=prod-build /app/node_modules /app/node_modules
COPY --from=prod-build /app/build /app/build
COPY --from=prod-build /app/start.sh /app/start.sh
COPY --from=prod-build /app/prisma /app/prisma
COPY --from=prod-build /app/package.json /app/package.json
COPY --from=prod-build /app/pnpm-lock.yaml /app/pnpm-lock.yaml
RUN pnpm install --prod
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]
