FROM node:14.20-slim AS FRONT
WORKDIR /usr/src/app
RUN mkdir -p /usr/src/app/webapp
WORKDIR /usr/src/app/webapp

COPY webapp .
RUN npm install
RUN npm run build

FROM golang:1.19 AS BACK
WORKDIR /usr/src/app
RUN mkdir -p /usr/src/app/webapp
COPY --from=FRONT /usr/src/app/webapp/dist /usr/src/app/webapp/dist

# pre-copy/cache go.mod for pre-downloading dependencies and only redownloading them
# in subsequent builds if they change
COPY ./server/go.mod ./server/go.sum ./
RUN go mod download && go mod verify
WORKDIR /usr/src/app/server
COPY ./server .
RUN go build  -v -o /usr/local/bin/connect4solver ./.
WORKDIR /usr/src/app/
ENTRYPOINT ["connect4solver", "-port", "8081"]





