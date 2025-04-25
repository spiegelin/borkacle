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

### Configuration with .env File

This application supports loading sensitive configuration from a `.env` file in the project root. This is the recommended way to configure the application without hardcoding credentials.

1. Create a `.env` file in the project root directory with the following structure:
```
# Database configuration
DB_URL=jdbc:oracle:thin:@oraclebot_high?TNS_ADMIN=/path/to/wallet
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Telegram bot configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_BOT_NAME=your_bot_name
```

2. A `.env.example` file is provided as a template. Make a copy of it and populate with your values:
```bash
cp .env.example .env
```

3. Run the application:
```bash
mvn spring-boot:run
```

Alternatively, you can also set these as system environment variables:

```bash
export DB_URL=jdbc:oracle:thin:@oraclebot_high?TNS_ADMIN=/path/to/wallet
export DB_USERNAME=your_username
export DB_PASSWORD=your_password
export TELEGRAM_BOT_TOKEN=your_telegram_bot_token
export TELEGRAM_BOT_NAME=your_bot_name
mvn spring-boot:run
```

Note: The `.env` file is excluded from git version control. Never commit sensitive credentials to the repository.

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