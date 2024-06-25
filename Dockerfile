# Use the official Node.js 20.14.0 image
FROM node:20.14.0 AS build

# Set a working directory
WORKDIR /app

# Install Angular CLI 18.0.4 globally
RUN npm install -g @angular/cli@18.0.4

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular app in production mode
RUN ng build --configuration production

# Install serve to serve the application
RUN npm install -g serve

# Copy the Node.js server file
COPY server.js .

# Expose port 8080
EXPOSE 8080

# Command to run the Node.js server
CMD ["node", "server.js"]
