# Use Node.js image to build the frontend
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the frontend
RUN npm run build

# Use Nginx to serve the frontend
FROM nginx:alpine

# Copy built files to Nginx's default web directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port (default 5173)
EXPOSE 5173

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
