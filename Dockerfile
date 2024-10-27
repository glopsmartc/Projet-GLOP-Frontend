# Stage 1: Build the Angular application
FROM node:20.17.0 AS build
# Set working directory
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install Angular CLI globally
RUN npm install -g @angular/cli@16.2.7

# Copy package.json and package-lock.json 
COPY package.json package-lock.json* ./

# Install app dependencies
RUN npm install

# Add the rest of the app
COPY . .

# Build the app for production
RUN npm run build 

# Stage 2: Serve the app using Nginx
FROM nginx:alpine

# Copy the Angular build files to Nginx
COPY --from=build /app/dist/frontend_glop /usr/share/nginx/html

# Copy the config.js template (with placeholder)
COPY src/assets/config.js /usr/share/nginx/html/assets/config.js

# Inject environment variable for API base URL using envsubst
CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/assets/config.js > /usr/share/nginx/html/assets/config.js && exec nginx -g 'daemon off;'"]
