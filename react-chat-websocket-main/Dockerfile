# ---- Step 1: Build the React Client ----
    FROM node:18 AS build-client

    WORKDIR /client
    
    # Copy frontend dependencies
    COPY client/package.json client/package-lock.json ./
    RUN npm install
    
    # Copy the entire frontend code and build it
    COPY client/ ./
    RUN npm run build
    
    # ---- Step 2: Set up the Node.js Server ----
    FROM node:18 AS server
    
    WORKDIR /app
    
    # Copy backend dependencies
    COPY server/package.json server/package-lock.json ./
    RUN npm install
    
    # Copy the backend code
    COPY server/ ./
    
    # Copy built frontend files from previous stage to backend's public folder
    COPY --from=build-client /client/dist ./public
    
    # Expose the port for the Node.js server
    EXPOSE 3001
    
    # Start the server
    CMD ["npm", "start"]
    