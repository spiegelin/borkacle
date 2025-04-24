# Borkacle Frontend Service

The Frontend service is a Next.js web application that provides the user interface for interacting with the Borkacle system.

## Overview

This Next.js application provides:
- Modern, responsive UI for Todo list management
- Integration with the controller service for data operations
- User authentication and session management

## Development Setup

### Prerequisites
- Node.js 20 or higher
- npm 10 or higher

### Running Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will be available at http://localhost:3000.

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env.local` file with the following variables:

| Variable | Description | Default |
|----------|-------------|---------|
| CONTROLLER_API_URL | URL of the controller service API | http://localhost:8080 |
| NEXT_PUBLIC_APP_URL | Public URL of the frontend application | http://localhost:3000 |

## Docker

To build and run with Docker:

```bash
# Build the Docker image
docker build -t borkacle/frontend .

# Run the container
docker run -p 3000:3000 -e CONTROLLER_API_URL=http://controller:8080 borkacle/frontend
```

## Kubernetes Deployment

Kubernetes manifests are available in the `k8s/` directory for deployment on OCI Kubernetes.
