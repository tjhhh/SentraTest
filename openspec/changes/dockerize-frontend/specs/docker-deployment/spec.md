## ADDED Requirements

### Requirement: Frontend Containerization
The frontend application SHALL be containerized using a `Dockerfile` located in the `frontend/` directory.

#### Scenario: Frontend builds successfully
- **WHEN** the `docker build -t frontend ./frontend` command is executed
- **THEN** a Docker image for the frontend is successfully created

### Requirement: Docker Compose Integration
The frontend service MUST be included in the root `docker-compose.yaml` file.

#### Scenario: Full stack starts via Docker Compose
- **WHEN** `docker-compose up` is executed
- **THEN** the `frontend`, `backend`, and `postgres` services are started successfully

### Requirement: Environment Configuration
The frontend container SHALL be configured to communicate with the backend service within the Docker network.

#### Scenario: Frontend connects to backend
- **WHEN** the frontend application makes an API request to the `backend` service (e.g., `http://backend:4000`)
- **THEN** the request is successfully routed and handled by the backend container
