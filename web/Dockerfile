FROM node:20-alpine AS build
WORKDIR /app
COPY web/package.json web/tsconfig.json web/vite.config.ts ./
COPY web/index.html ./index.html
COPY web/src ./src
RUN npm install && npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
