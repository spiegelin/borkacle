# Borkacle

Borkacle is a distributed system consisting of three main services: a Telegram bot, a controller API, and a web frontend.

## Project Structure

```
borkacle/
├── bot/              # Telegram bot service (Java Spring Boot)
├── controller/       # Controller API service (Java Spring Boot)
├── frontend/         # Web frontend (Next.js)
└── docker-compose.yml # Docker Compose configuration
```

## Services

### Bot Service
A Spring Boot application that provides a Telegram bot interface for interacting with the system.

### Controller Service
A Spring Boot application that acts as the backend coordinator between the Bot and Frontend services.

### Frontend Service
A Next.js application that provides a web interface for users to interact with the system.

## Local Development

Each service can be run individually in development mode. See the README in each service directory for specific instructions.

## Docker Deployment

The entire system can be run using Docker Compose:

```bash
# Set your Telegram bot token
export TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# Build and start all services
docker-compose up -d
```

## Kubernetes Deployment on OCI

Each service includes Kubernetes manifests in its `k8s/` directory for deployment on Oracle Cloud Infrastructure Kubernetes Engine.

### Prerequisites for OCI Deployment
- OCI CLI configured with appropriate permissions
- kubectl configured to access your OCI Kubernetes cluster
- Container Registry access in OCI

### Deployment Steps

1. Build and push Docker images to OCI Container Registry
2. Deploy services using the Kubernetes manifests
3. Configure the Ingress for external access

See detailed deployment instructions in each service's README.
