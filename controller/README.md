# Borkacle Controller Service

The Controller service acts as a backend coordinator between the Bot and Frontend services in the Borkacle application.

## Overview

This Spring Boot application provides REST APIs to:
- Coordinate communication between the Bot and Frontend services
- Process business logic for the application

## Development Setup

### Prerequisites
- Java 11 or higher
- Maven 3.6 or higher

### Running Locally

```bash
# Install dependencies and build
mvn clean install

# Run the application
mvn spring-boot:run
```

The service will start on port 8080 by default. You can access the health endpoint at http://localhost:8080/api/health

### Environment Variables

The following environment variables can be configured:

| Variable | Description | Default |
|----------|-------------|---------|
| SERVER_PORT | Port on which the service runs | 8080 |
| BOT_SERVICE_URL | URL to connect to the Bot service | http://bot:8080 |
| FRONTEND_SERVICE_URL | URL to connect to the Frontend service | http://frontend:3000 |

### Configuration with .env File

This application supports loading sensitive configuration from a `.env` file in the project root. This is the recommended way to configure the application without hardcoding credentials.

1. Create a `.env` file in the project root directory with the following structure:
```
# Database configuration
DB_URL=jdbc:oracle:thin:@oraclebot_high?TNS_ADMIN=/path/to/wallet
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Oracle wallet configuration
WALLET_LOCATION=(SOURCE=(METHOD=file)(METHOD_DATA=(DIRECTORY=/path/to/wallet)))
TNS_ADMIN=/path/to/wallet
TRUST_STORE=/path/to/wallet/truststore.jks
TRUST_STORE_PASSWORD=your_password
KEY_STORE=/path/to/wallet/keystore.jks
KEY_STORE_PASSWORD=your_password

# Telegram bot configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_BOT_NAME=your_bot_name

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION_MS=86400000
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
# Set other variables...
mvn spring-boot:run
```

Note: The `.env` file is excluded from git version control. Never commit sensitive credentials to the repository.

## Docker

To build and run with Docker:

```bash
# Build the Docker image
docker build -t borkacle/controller .

# Run the container
docker run -p 8080:8080 borkacle/controller
```

## Kubernetes Deployment

Kubernetes manifests are available in the `k8s/` directory for deployment on OCI Kubernetes. 