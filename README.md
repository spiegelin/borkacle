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

## Database Setup

This section outlines how to set up an Oracle Autonomous Database on OCI and define the required schema.

### 1. Create OCI Autonomous Database

Follow these steps to create an Autonomous Transaction Processing (ATP) database instance in Oracle Cloud Infrastructure:

1.  **Navigate to OCI Console:** Log in to your OCI account.
2.  **Create Autonomous Database:**
    *   From the navigation menu, select "Oracle Database" and then "Autonomous Transaction Processing".
    *   Click "Create Autonomous Database".
3.  **Configuration:**
    *   **Display Name & Database Name:** Provide suitable names (e.g., `BorkacleDB`).
    *   **Workload Type:** Select "Transaction Processing".
    *   **Deployment Type:** Choose "Shared Infrastructure" for most use cases or "Dedicated Infrastructure" if required.
    *   **Configure the database:**
        *   **Always Free:** Enable if you want to use the Always Free tier (note limitations on CPU/Storage).
        *   **Choose database version:** Select the desired version (e.g., 19c, 21c).
        *   **OCPU count & Storage (TB):** Allocate resources as needed. Auto-scaling can be enabled.
    *   **Create administrator credentials:** Set a strong password for the `ADMIN` user.
    *   **Choose network access:**
        *   Select "Secure access from everywhere" for simplicity during initial development (ensure you understand the security implications).
        *   For production, prefer "Secure access from allowed IPs and VCNs only" and configure your VCN and Network Security Group (NSG) or Access Control Lists (ACLs).
        *   Alternatively, use "Private endpoint access only" if your services will run within the same VCN.
    *   **Choose license type:** Select "License Included" or "Bring Your Own License (BYOL)".
4.  **Create Database:** Click "Create Autonomous Database". Provisioning will take a few minutes.
5.  **Download Client Credentials (Wallet):**
    *   Once the database status is "Available", click on the database name to view its details.
    *   Click "DB Connection".
    *   For "Wallet Type", select "Instance Wallet".
    *   Click "Download Wallet" and provide a password for the wallet. Store this password securely.
    *   This wallet (`Wallet_<DBName>.zip`) contains `tnsnames.ora`, `sqlnet.ora`, `keystore.jks`, `truststore.jks`, etc., and is required for the application to connect to the database. Extract its contents to the `wallet/` directory in your project root.

### 2. Database Schema (SQL DDL)

Connect to your Autonomous Database using a SQL client (e.g., SQL Developer, `sqlcl`) with the admin credentials and wallet downloaded in the previous step. Execute the following DDL statements to create the necessary tables:

```sql
-- Lookup table for Task States
CREATE TABLE ESTADOS (
    ID NUMBER(19) GENERATED BY DEFAULT ON NULL AS IDENTITY PRIMARY KEY,
    NOMBRE VARCHAR2(255 CHAR) NOT NULL UNIQUE
);

-- Lookup table for Task Priorities
CREATE TABLE PRIORIDADES (
    ID NUMBER(19) GENERATED BY DEFAULT ON NULL AS IDENTITY PRIMARY KEY,
    NOMBRE VARCHAR2(255 CHAR) NOT NULL UNIQUE,
    DESCRIPCION CLOB,
    FECHA_CREACION TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for Teams
CREATE TABLE EQUIPOS (
    ID NUMBER(19) GENERATED BY DEFAULT ON NULL AS IDENTITY PRIMARY KEY,
    NOMBRE VARCHAR2(255 CHAR) NOT NULL UNIQUE,
    MANAGER_ID NUMBER(19) -- Can be NULL if a team doesn't have a manager or for self-reference later
    -- CONSTRAINT FK_EQUIPO_MANAGER FOREIGN KEY (MANAGER_ID) REFERENCES USUARIOS(ID) -- Add this alter table after USUARIOS is created
);

-- Table for Users
CREATE TABLE USUARIOS (
    ID NUMBER(19) GENERATED BY DEFAULT ON NULL AS IDENTITY PRIMARY KEY,
    NOMBRE VARCHAR2(255 CHAR) NOT NULL UNIQUE,
    EMAIL VARCHAR2(255 CHAR) NOT NULL UNIQUE,
    PASSWORD_HASH VARCHAR2(255 CHAR) NOT NULL,
    MFA_ENABLED VARCHAR2(10 CHAR) DEFAULT 'false', -- Store as 'true'/'false' or use NUMBER(1)
    MFA_TOTP_SECRET VARCHAR2(255 CHAR),
    ROL VARCHAR2(50 CHAR) NOT NULL,
    FECHA_REGISTRO TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    TELEGRAM_ID VARCHAR2(255 CHAR) UNIQUE,
    EQUIPO_ID NUMBER(19),
    CONSTRAINT FK_USUARIO_EQUIPO FOREIGN KEY (EQUIPO_ID) REFERENCES EQUIPOS(ID)
);

-- Add foreign key from EQUIPOS to USUARIOS (for manager)
ALTER TABLE EQUIPOS
ADD CONSTRAINT FK_EQUIPO_MANAGER FOREIGN KEY (MANAGER_ID) REFERENCES USUARIOS(ID);

-- Table for Sprints
CREATE TABLE SPRINTS (
    ID NUMBER(19) GENERATED BY DEFAULT ON NULL AS IDENTITY PRIMARY KEY,
    NOMBRE VARCHAR2(255 CHAR) NOT NULL,
    FECHA_INICIO DATE,
    FECHA_FIN DATE,
    ESTADO VARCHAR2(50 CHAR) -- e.g., 'PLANNED', 'ACTIVE', 'COMPLETED'
);

-- Table for Tasks
CREATE TABLE TAREAS (
    ID NUMBER(19) GENERATED BY DEFAULT ON NULL AS IDENTITY PRIMARY KEY,
    TITULO VARCHAR2(500 CHAR) NOT NULL,
    DESCRIPCION CLOB,
    ESTADO_ID NUMBER(19) NOT NULL,
    PRIORIDAD_ID NUMBER(19) NOT NULL,
    ASIGNADO_A NUMBER(19),
    PROYECTO_ID NUMBER(19), -- Assuming this is a generic project identifier if not a separate table
    SPRINT_ID NUMBER(19),
    FECHA_CREACION TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FECHA_ACTUALIZACION TIMESTAMP WITH TIME ZONE,
    TIEMPO_ESTIMADO NUMBER(5,2), -- e.g., hours
    TIEMPO_REAL NUMBER(5,2),     -- e.g., hours
    TIPO VARCHAR2(100 CHAR),     -- e.g., 'BUG', 'FEATURE', 'CHORE'
    CONSTRAINT FK_TAREA_ESTADO FOREIGN KEY (ESTADO_ID) REFERENCES ESTADOS(ID),
    CONSTRAINT FK_TAREA_PRIORIDAD FOREIGN KEY (PRIORIDAD_ID) REFERENCES PRIORIDADES(ID),
    CONSTRAINT FK_TAREA_ASIGNADO FOREIGN KEY (ASIGNADO_A) REFERENCES USUARIOS(ID),
    CONSTRAINT FK_TAREA_SPRINT FOREIGN KEY (SPRINT_ID) REFERENCES SPRINTS(ID)
);

-- Table for Comments on Tasks
CREATE TABLE COMENTARIOS (
    ID NUMBER(19) GENERATED BY DEFAULT ON NULL AS IDENTITY PRIMARY KEY,
    TAREA_ID NUMBER(19) NOT NULL,
    USUARIO_ID NUMBER(19) NOT NULL,
    COMENTARIO CLOB NOT NULL,
    FECHA TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_COMENTARIO_TAREA FOREIGN KEY (TAREA_ID) REFERENCES TAREAS(ID),
    CONSTRAINT FK_COMENTARIO_USUARIO FOREIGN KEY (USUARIO_ID) REFERENCES USUARIOS(ID)
);

-- Table for Notifications
CREATE TABLE NOTIFICACIONES (
    ID NUMBER(19) GENERATED BY DEFAULT ON NULL AS IDENTITY PRIMARY KEY,
    TAREA_ID NUMBER(19), -- Can be null if notification is not related to a specific task
    USUARIO_ID NUMBER(19) NOT NULL, -- User to whom the notification is addressed
    DESCRIPCION VARCHAR2(1000 CHAR) NOT NULL,
    FECHA_ENVIO TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    LEIDO VARCHAR2(10 CHAR) DEFAULT 'false', -- Store as 'true'/'false' or use NUMBER(1)
    CONSTRAINT FK_NOTIFICACION_TAREA FOREIGN KEY (TAREA_ID) REFERENCES TAREAS(ID),
    CONSTRAINT FK_NOTIFICACION_USUARIO FOREIGN KEY (USUARIO_ID) REFERENCES USUARIOS(ID)
);

-- Example: Insert initial data for lookup tables (optional)
-- INSERT INTO ESTADOS (NOMBRE) VALUES ('PENDIENTE');
-- INSERT INTO ESTADOS (NOMBRE) VALUES ('EN_PROGRESO');
-- INSERT INTO ESTADOS (NOMBRE) VALUES ('COMPLETADA');
-- INSERT INTO ESTADOS (NOMBRE) VALUES ('CANCELADA');

-- INSERT INTO PRIORIDADES (NOMBRE, DESCRIPCION) VALUES ('ALTA', 'Prioridad alta para tareas críticas.');
-- INSERT INTO PRIORIDADES (NOMBRE, DESCRIPCION) VALUES ('MEDIA', 'Prioridad media para tareas estándar.');
-- INSERT INTO PRIORIDADES (NOMBRE, DESCRIPCION) VALUES ('BAJA', 'Prioridad baja para tareas no urgentes.');

```

Make sure the `wallet/` directory in your project root is populated with the contents of the downloaded wallet zip file, and your `.env` file is correctly configured with the database URL, username (`ADMIN`), password, and wallet details as required by your Spring Boot applications.

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
