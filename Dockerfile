# Use the official Node.js image as the base image
FROM node:14 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Angular app
RUN npm run build --prod

# Use a lightweight web server to serve the Angular app
FROM nginx:alpine

# Copy the build output to the Nginx web server directory
COPY --from=build /app/dist/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
