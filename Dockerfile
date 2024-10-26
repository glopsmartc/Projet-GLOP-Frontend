# Stage 1: Build the Angular application
FROM node:20.17.0 AS build

# Set working directory
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install Angular CLI globally
RUN npm install -g @angular/cli@16.2.7

# Copy package.json and package-lock.json 
COPY package.json package-lock.json* /app/

# Install app dependencies
RUN npm install

# Copy the rest of the app
COPY . /app

# Build the app in production mode
RUN ng build --configuration production --base-href / 

# Stage 2: Serve the application using nginx
FROM nginx:alpine

# Copy built files from the build stage to the nginx html folder
COPY --from=build /app/dist/frontend_glop /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
