FROM oven/bun:1

WORKDIR /backend

COPY deploy/backend/package*.json ./
COPY deploy/backend/bun.lock ./

RUN bun install
RUN bun add -g pm2

COPY deploy/backend/ ./
COPY deploy/tools/docker/backend/entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]