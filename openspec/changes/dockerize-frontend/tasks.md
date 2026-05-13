## 1. Preparation

- [x] 1.1 Create `frontend/.dockerignore` to exclude build artifacts and node_modules
- [x] 1.2 Refine `frontend/Dockerfile` to ensure it correctly builds the Next.js application

## 2. Docker Compose Integration

- [x] 2.1 Add the `frontend` service definition to `docker-compose.yaml`
- [x] 2.2 Configure `NEXT_PUBLIC_API_URL` environment variable in `docker-compose.yaml`

## 3. Verification

- [x] 3.1 Build and start the full stack using `docker-compose up --build`
- [x] 3.2 Verify that the frontend is accessible at `http://localhost:3000`
- [x] 3.3 Verify that the frontend can successfully communicate with the backend
