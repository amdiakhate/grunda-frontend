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

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install http-server
RUN npm install -g http-server

# Copy only the built files
COPY --from=builder /app/dist ./dist

EXPOSE 5173

# Start the app with SPA support and listen on all interfaces (0.0.0.0)
CMD ["http-server", "dist", "--port", "5173", "-a", "0.0.0.0", "-P", "http://0.0.0.0:5173?", "--cors"] 