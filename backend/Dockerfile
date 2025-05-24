# Dockerfile
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Copy .env file if needed (optional - can be passed via --env-file too)
COPY .env .env

# Build the TypeScript project
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the application using the start script from package.json
CMD ["npm", "run", "start"]
