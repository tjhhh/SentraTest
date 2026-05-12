# Proposal: Fix Playwright Execution in Docker

## Problem
The current backend Docker setup uses `node:22-alpine`, which lacks the necessary system dependencies (glibc, font libraries, etc.) and the browser binaries required by Playwright. This results in an `executable doesn't exist` error when attempting to run tests in the containerized environment.

## Goals
- Ensure Playwright can execute tests within the Docker container.
- Minimize manual setup for new environments.
- Improve browser stability in containerized environments.

## Proposed Changes
- **Backend Dockerfile**: Switch from Alpine to the official Playwright base image (`mcr.microsoft.com/playwright:v1.60.0`).
- **Build Process**: Include `npx playwright install` and system dependency installation in the Docker build process.
- **Docker Compose**: Configure shared memory (`shm_size`) and IPC settings to support stable Chromium execution.

## Risks & Mitigations
- **Image Size**: The Playwright base image is larger than Alpine. *Mitigation*: We will use a multi-stage build or only install the necessary browser (Chromium) to keep the final image as lean as possible.
- **Node Version**: The Playwright image might use a slightly different Node version. *Mitigation*: We will verify compatibility with Node 22 (current backend requirement).
