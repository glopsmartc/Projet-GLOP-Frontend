FROM node:20.17.0 AS build
# Set working directory
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install Angular CLI globally
RUN npm install -g @angular/cli@16.2.7

# Copy package.json and package-lock.json (if available)
COPY package.json package-lock.json* /app/

# Install app dependencies
RUN npm install


# Add the rest of the app
COPY . /app

# Start the app
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--configuration=production"]
