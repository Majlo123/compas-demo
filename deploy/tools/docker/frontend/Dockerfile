FROM oven/bun:1

WORKDIR /frontend

COPY deploy/frontend/package*.json ./
COPY deploy/frontend/bun.lock ./

RUN bun install

COPY deploy/frontend/ ./
COPY deploy/tools/docker/frontend/entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

EXPOSE 5173

CMD ["bun", "dev"]