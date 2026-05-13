## Context

The project currently uses Docker Compose to manage the database and backend. The frontend is currently run manually. To improve developer experience and environment consistency, the frontend should be integrated into the Docker Compose setup.

## Goals / Non-Goals

**Goals:**
- Containerize the Next.js frontend.
- Integrate the frontend service into `docker-compose.yaml`.
- Ensure the frontend can communicate with the backend API.
- Use environment variables to configure the API base URL.

**Non-Goals:**
- Setting up a production-ready CDN or load balancer.
- Implementing advanced CI/CD pipelines.

## Decisions

- **Base Image**: Use `node:20-alpine` for consistency with the backend and to keep image size small.
- **Docker Compose Integration**: Add a `frontend` service to `docker-compose.yaml` that builds from the `./frontend` directory.
- **Environment Variables**: Use `NEXT_PUBLIC_API_URL` to point the frontend to the backend service. Since this is a Next.js application, these variables are baked in at build time. For local development via Docker Compose, we will set this in the `environment` section.
- **Optimized Build**: Use a multi-stage Docker build to keep the final image clean (already partially present in the existing `Dockerfile`, will be refined).
- **.dockerignore**: Implement a `.dockerignore` file to prevent copying `node_modules`, `.next`, and other unnecessary files into the build context.

## Risks / Trade-offs

- **[Risk] Build-time Environment Variables**: `NEXT_PUBLIC_` variables are baked in during `next build`. If the API URL changes, the image must be rebuilt.
  - **Mitigation**: For local development, this is acceptable. If dynamic configuration is needed later, a runtime config pattern could be implemented.
- **[Risk] Large Image Size**: Node images can be large.
  - **Mitigation**: Use `alpine` variants and multi-stage builds.
