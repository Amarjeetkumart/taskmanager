FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/nginx.conf

# Copy custom configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create log directory
RUN mkdir -p /var/log/nginx

# Add healthcheck
RUN apk add --no-cache wget

# Expose ports
EXPOSE 80 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
