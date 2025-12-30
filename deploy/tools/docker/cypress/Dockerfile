FROM cypress/included:13.6.0

WORKDIR /cypress

COPY deploy/cypress/package*.json ./

RUN npm install

COPY deploy/cypress/ .

CMD ["cypress", "run"]
