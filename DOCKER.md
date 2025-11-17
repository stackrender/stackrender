# Docker Deployment Guide

This guide explains how to run StackRender using Docker.

## Quick Start

### Using Docker Compose (Recommended)

The easiest way to run StackRender:

```bash
docker-compose up -d
```

The application will be available at `http://localhost:8080`

To stop the application:

```bash
docker-compose down
```

### Using Docker CLI

Build the image:

```bash
docker build -t stackrender .
```

Run the container:

```bash
docker run -d -p 8080:80 --name stackrender stackrender
```

Stop and remove the container:

```bash
docker stop stackrender
docker rm stackrender
```

## Configuration

### Port Mapping

By default, the application runs on port 80 inside the container and is mapped to port 8080 on the host. You can change this in `docker-compose.yml`:

```yaml
ports:
  - "YOUR_PORT:80"
```

Or when using Docker CLI:

```bash
docker run -d -p YOUR_PORT:80 --name stackrender stackrender
```

### Health Check

The Docker Compose configuration includes a health check that verifies the application is responding correctly:

```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:80/"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## Architecture

### Multi-Stage Build

The Dockerfile uses a multi-stage build approach:

1. **Builder Stage**: Uses Node.js 20 to install dependencies and build the application
2. **Production Stage**: Uses Nginx Alpine to serve the static files

This approach minimizes the final image size by excluding build tools and dependencies.

### Nginx Configuration

The application uses a custom Nginx configuration (`nginx.conf`) that:

- Enables gzip compression for better performance
- Sets security headers (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
- Handles client-side routing (React Router)
- Configures caching for static assets

## Troubleshooting

### Build Issues

If you encounter SSL certificate issues during the build, the Dockerfile includes a workaround:

```dockerfile
RUN npm config set strict-ssl false && npm install
```

This is necessary in some build environments with certificate validation issues.

### Container Not Starting

Check the logs:

```bash
docker logs stackrender
```

Or with Docker Compose:

```bash
docker-compose logs
```

### Port Already in Use

If port 8080 is already in use, you can change it in `docker-compose.yml` or use a different port with Docker CLI:

```bash
docker run -d -p 8081:80 --name stackrender stackrender
```

## Development

For development, it's recommended to run the application directly with Node.js instead of Docker:

```bash
npm install
npm run dev
```

Docker is primarily intended for production deployments or testing the production build locally.

## Production Deployment

For production deployments:

1. Build the image:
   ```bash
   docker build -t stackrender:production .
   ```

2. Push to your container registry:
   ```bash
   docker tag stackrender:production your-registry/stackrender:latest
   docker push your-registry/stackrender:latest
   ```

3. Deploy using your orchestration tool (Kubernetes, Docker Swarm, etc.)

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
