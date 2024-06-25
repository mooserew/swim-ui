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

# Use nginx to serve the built Angular app
FROM nginx:alpine

# Copy the built Angular app from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
