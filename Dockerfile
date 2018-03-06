# alpine image
FROM node:alpine

# maintainer
LABEL maintainer Dave Bullough <hello@pacosystems.com>

# install bash for convenience
RUN apk --no-cache add bash

RUN mkdir -p /application

WORKDIR /application
# 
COPY package.json package.json
RUN npm install --production

COPY files files/
COPY app.js app.js

CMD ["node", "app.js"]