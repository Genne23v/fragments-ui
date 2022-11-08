# stage 0: Install dependencies
FROM node:16.15.1-alpine3.15@sha256:1fafca8cf41faf035192f5df1a5387656898bec6ac2f92f011d051ac2344f5c9 AS dependencies

# To give node modules information that it's production env
ENV NODE_ENV=production

WORKDIR /app

COPY package*.json /app/

# Install only production dependencies
RUN npm ci --only=production

###################################################################################################

# stage 1: Build microservice 
FROM node:16.15.1-alpine3.15@sha256:1fafca8cf41faf035192f5df1a5387656898bec6ac2f92f011d051ac2344f5c9 AS build

LABEL maintainer="Wonkeun No <wno@myseneca.ca>"
LABEL description="Fragments UI React microservice"

WORKDIR /app

COPY --from=dependencies /app /app
COPY  ./ ./

RUN npm run build

###################################################################################################

# stage 2: Serve the site
FROM nginx:1.22.1-alpine@sha256:d24e098389beed466ea300d5473cdda939bf6e91a93873d0fd1dd18e138c2f13 AS deploy

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl --fail localhost || exit 1
