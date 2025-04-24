# Borkacle Bot Service

The Bot service is a Telegram bot backend that interacts with users through Telegram and communicates with the controller service.

## Overview

This Spring Boot application provides:
- Telegram bot integration
- User command handling for Todo list management
- Communication with the controller service for data processing

## Development Setup

### Prerequisites
- Java 11 or higher
- Maven 3.6 or higher
- Telegram Bot Token (from BotFather)

### Running Locally

```bash
# Install dependencies and build
mvn clean install

# Run the application
mvn spring-boot:run -DTELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

The service will start on port 8080 by default.

### Environment Variables

The following environment variables can be configured:

| Variable | Description | Default |
|----------|-------------|---------|
| TELEGRAM_BOT_TOKEN | Your Telegram bot token from BotFather | Required |
| CONTROLLER_SERVICE_URL | URL to connect to the Controller service | http://controller:8080 |

## Docker

To build and run with Docker:

```bash
# Build the Docker image
docker build -t borkacle/bot .

# Run the container
docker run -p 8080:8080 -e TELEGRAM_BOT_TOKEN=your_telegram_bot_token borkacle/bot
```

## Kubernetes Deployment

Kubernetes manifests are available in the `k8s/` directory for deployment on OCI Kubernetes. 