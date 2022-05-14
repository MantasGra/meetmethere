# Build environment
FROM node:16-alpine as react-build
ARG SNOWPACK_PUBLIC_GOOGLE_API_KEY
ENV SNOWPACK_PUBLIC_GOOGLE_API_KEY=${SNOWPACK_PUBLIC_GOOGLE_API_KEY}
WORKDIR /usr/src/app
COPY . ./
RUN npm install && npm run build

# Server environment
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/configfile.template
COPY --from=react-build /usr/src/app/build /usr/share/nginx/html

ENV PORT 8080
ENV HOST 0.0.0.0
EXPOSE 8080
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
