# Build stage - using standard debian-based node image for better compatibility
FROM node:20 AS builder

WORKDIR /app

# Copy package files  
COPY package*.json ./

# Install dependencies
# Note: strict-ssl is disabled to handle potential certificate issues in some build environments
RUN npm config set strict-ssl false && npm install

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
