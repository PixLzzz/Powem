### STAGE 1: Build ###
FROM node:14-alpine AS build
WORKDIR /usr/src/app
COPY Front/package.json Front/package-lock.json ./
RUN npm install
COPY Front/ .
RUN npm run build

### STAGE 2: Run ###
FROM nginx:alpine
#COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/Front /usr/share/nginx/html