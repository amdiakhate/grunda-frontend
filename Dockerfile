# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build arguments for environment
ARG VITE_API_URL
ARG VITE_APP_ENV

# Set environment variables
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_ENV=$VITE_APP_ENV

# Build the app
RUN npm run build

# Development stage
FROM node:18-alpine

WORKDIR /app

# Copy built assets and package files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/vite.config.ts ./

# Install only production dependencies
RUN npm install vite

EXPOSE 5173

# Start Vite in preview mode, listening on all interfaces
CMD ["npm", "exec", "vite", "preview", "--host", "0.0.0.0", "--port", "5173"] 