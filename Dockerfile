FROM node:22-alpine as builder
WORKDIR /app
COPY . .
RUN npm install && npm install -g @angular/cli && ng build --configuration=production

FROM nginx:latest

COPY --from=builder app/dist/corpo-front/browser /usr/share/nginx/html

EXPOSE 80