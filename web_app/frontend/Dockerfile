
# Stage 1: Build the React application
FROM node:20-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY web_app/frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY web_app/frontend/ .

# Build the application
# We need to accept build-time arg for VITE_API_URL if we want to bake it in, 
# OR use a placeholder and replace it at runtime. 
# For simplicity in this stack, we will assume standard build.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY web_app/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
