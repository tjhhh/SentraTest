## Why

The frontend currently runs outside of the Docker environment, which leads to inconsistencies and manual setup steps for developers. Integrating the frontend into the Docker environment ensures that the entire stack can be started with a single command and runs in a consistent environment.

## What Changes

- **Add Frontend to Docker Compose**: Integrate the frontend service into `docker-compose.yaml`.
- **Add .dockerignore**: Create a `.dockerignore` file for the frontend to exclude `node_modules`, `.next`, and other build artifacts.
- **Update Dockerfile**: Ensure the frontend `Dockerfile` is correctly configured to run the Next.js application.

## Capabilities

### New Capabilities
- `docker-deployment`: Infrastructure support for running the full stack (frontend, backend, database) in Docker containers.

### Modified Capabilities
- (None)

## Impact

- `docker-compose.yaml`: Will now include the `frontend` service.
- `frontend/`: New `.dockerignore` file.
- `frontend/Dockerfile`: Potential minor updates to ensure compatibility with `docker-compose`.
