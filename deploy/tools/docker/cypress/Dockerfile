FROM cypress/included:13.6.0

WORKDIR /e2e

COPY deploy/cypress/package.json deploy/cypress/package-lock.json* ./

RUN npm ci

COPY deploy/cypress/ .

CMD ["cypress", "run"]
