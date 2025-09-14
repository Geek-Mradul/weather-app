# Stage 1: Build the React application
FROM node:18-alpine AS build

# Declare the build argument for the API key
ARG VITE_OPENWEATHER_API_KEY

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Make the argument available as an environment variable for the build script
ENV VITE_OPENWEATHER_API_KEY=$VITE_OPENWEATHER_API_KEY

# Build the application for production
# Vite will embed the API key into the static files during this step
RUN npm run build

# Stage 2: Serve the static files with Nginx
FROM nginx:1.25-alpine

# Copy the built static files from the 'build' stage to the Nginx server directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# The default command to start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]