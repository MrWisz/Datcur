FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build TypeScript
RUN npm run build

# Expose the port
EXPOSE 3000

# Start app with more memory (prevent OOM crash)
CMD ["node", "--max-old-space-size=512", "dist/main"]
