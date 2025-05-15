# Borkacle

Borkacle is a distributed task and sprint management system consisting of three main services: a Telegram bot interface, a central controller API, and a web frontend.

## Features

*   **User Authentication:** Login, Signup, Logout.
*   **Task Management:** Create, Read, Update, Delete (implicitly via status change), List tasks.
*   **Task Assignment:** Assign tasks to users and sprints.
*   **Task Workflow:** Update task status (e.g., Pending, In Progress, Completed), assign priority, log completion time.
*   **Sprint Management:** Create, List sprints with associated tasks, View sprint details.
*   **User Management:** List users (with team info), View user details, Update user information.
*   **Telegram Bot:** Interact with tasks/sprints via Telegram commands (provided by the `bot` service).
*   **Web Interface:** Manage tasks and sprints via a modern web UI (provided by the `frontend` service).
*   **KPIs:** View key performance indicators (via `/api/kpi` endpoint).

## Tech Stack

*   **Backend (Controller & Bot):** Java, Spring Boot, Spring Data JPA, Spring Security
*   **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Shadcn UI, Dnd-Kit
*   **Database:** Oracle Database (requires Oracle Wallet for connection)
*   **Containerization:** Docker, Docker Compose
*   **Orchestration:** Kubernetes (with manifests for OCI)

## Project Structure

```
borkacle/
├── bot/              # Telegram bot service (Java Spring Boot)
├── controller/       # Controller API service (Java Spring Boot)
├── frontend/         # Web frontend (Next.js)
├── wallet/           # Oracle Wallet files (MUST be populated)
├── k8s/              # Contains Kubernetes manifests (as per DEPLOY.md)
├── .env              # Environment variables (local, docker-compose) - IMPORTANT
├── docker-compose.yml # Docker Compose configuration
├── DEPLOY.md         # Detailed K8s deployment guide
├── README.md         # This file
└── ...               # Other configuration files
```

## Prerequisites

*   **Java Development Kit (JDK):** Version 11 or higher (check `pom.xml` for specifics)
*   **Maven:** For building Java services
*   **Node.js & npm:** For building and running the frontend service
*   **Docker & Docker Compose:** For containerized execution
*   **Oracle Database:** An accessible Oracle DB instance.
*   **Oracle Wallet:** Properly configured Oracle Wallet files in the `wallet/` directory.
*   **(Optional) kubectl:** For Kubernetes deployment.
*   **(Optional) OCI CLI:** For Oracle Cloud Infrastructure Kubernetes deployment.

## Configuration

1.  **Oracle Wallet:** Place your Oracle Wallet files (`tnsnames.ora`, `sqlnet.ora`, `cwallet.sso`, etc.) into the root `wallet/` directory.
2.  **Environment Variables:** Create a `.env` file in the project root directory. Populate it with necessary configuration based on `.env.example` (if available) or the required variables for the services:
    *   `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` (for controller/bot)
    *   `TRUST_STORE_PASSWORD`, `KEY_STORE_PASSWORD` (for controller/bot)
    *   `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_NAME` (for bot)
    *   `JWT_SECRET`, `JWT_EXPIRATION_MS` (for controller)
    *   `NEXT_PUBLIC_API_URL=http://localhost:8080` (for frontend, adjust if needed)
    *   Other service-specific variables.

## Running the Application

There are four primary ways to run Borkacle:

### 1. Local Development Mode

Run each service independently. Ensure the Oracle DB is accessible and the `wallet/` directory and `.env` file are configured.

```bash
# Terminal 1: Run Controller API (Needs DB)
cd controller
mvn clean install
# Ensure .env is configured or pass variables via command line/IDE
mvn spring-boot:run

# Terminal 2: Run Frontend
cd frontend
npm install
# Reads NEXT_PUBLIC_API_URL from .env or defaults
npm run dev # Or: npm run build && npm start for production build

# Terminal 3: Run Telegram Bot (Needs DB & Controller)
cd bot
mvn clean install
# Ensure .env is configured or pass variables via command line/IDE
mvn spring-boot:run
```

### 2. Docker Compose

This is the recommended way to run all services together locally using containers. It uses the `docker-compose.yml` file and requires the `.env` file for configuration.

```bash
# Make sure Docker Desktop is running
# Ensure ./wallet/ directory is populated
# Ensure .env file is present and configured in the root directory

docker-compose up -d --build

# To stop the services:
docker-compose down
```

### 3. Individual Docker Containers

Build and run each service as a separate Docker container. This requires manual network configuration since containers need to communicate (Docker Compose handles this automatically).

```bash
# Ensure ./wallet/ directory is populated
# Ensure .env file is present for --env-file flag

# Build images (use --platform if needed, e.g., for Mac M1/M2)
docker build -t borkacle-controller:latest ./controller
docker build -t borkacle-frontend:latest ./frontend
docker build -t borkacle-bot:latest ./bot

# Run Controller (Example - adjust volume path, network, ports as needed)
docker run -d --name borkacle-controller \
  -p 8080:8080 \
  -v "$(pwd)/wallet:/app/wallet" \
  --env-file .env \
  borkacle-controller:latest

# Run Frontend (Example - adjust network, ports as needed)
docker run -d --name borkacle-frontend \
  -p 3000:3000 \
  --env NEXT_PUBLIC_API_URL=http://<controller_ip_or_hostname>:8080 \
  # Or use Docker network alias if on the same network
  borkacle-frontend:latest

# Run Bot (Example - adjust volume path, network as needed)
docker run -d --name borkacle-bot \
  -v "$(pwd)/wallet:/app/wallet" \
  --env-file .env \
  borkacle-bot:latest
```
*Note: Replace `<controller_ip_or_hostname>` with the actual IP/hostname accessible by the frontend container, or use Docker networking features.* 

### 4. Kubernetes (OCI)

For deploying to a Kubernetes cluster, specifically Oracle Cloud Infrastructure (OCI) Kubernetes Engine (OKE).

**See [DEPLOY.md](DEPLOY.md) for detailed prerequisites, configuration (secrets), and deployment steps.**

## API Documentation

The primary API is exposed by the `controller` service running (by default) on port 8080. You can explore the endpoints implemented in `controller/src/main/java/com/borkacle/controller/`.

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

This project is licensed under the terms of the [LICENSE.txt](LICENSE.txt) file.
