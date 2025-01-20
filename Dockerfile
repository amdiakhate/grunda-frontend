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

# Install a simple static file server
RUN npm install -g serve@14.2.1

# Copy only the built files
COPY --from=builder /app/dist ./dist

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --quiet --tries=1 --spider http://localhost:5173/ || exit 1

EXPOSE 5173

# Start serve with all necessary options
CMD ["serve", "-s", "dist", "--listen", "0.0.0.0:5173", "--cors", "--no-clipboard", "--single"] 