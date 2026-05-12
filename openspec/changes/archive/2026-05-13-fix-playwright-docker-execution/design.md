# Design: Playwright Docker Integration

## Architecture Overview
The backend will run on a Debian-based image that comes pre-configured with the libraries needed to run headless browsers.

## Dockerfile Strategy
We will use `mcr.microsoft.com/playwright:v1.60.0` as the runner stage. 

### Key Dockerfile Steps:
1. **Base**: `mcr.microsoft.com/playwright:v1.60.0` (includes Node.js and system deps).
2. **Install**: `npm ci` to get `@playwright/test`.
3. **Browsers**: `npx playwright install chromium --with-deps` (Installing only Chromium to save space).
4. **App**: Copy source and prisma files.

## Infrastructure Changes
### Docker Compose
- **SHM Size**: Set `shm_size: '2gb'` for the backend service. This prevents Chromium from crashing when it runs out of shared memory.
- **IPC**: Set `ipc: host` if necessary, though `shm_size` is often sufficient for most use cases.

## Validation Plan
1. Rebuild the backend image: `docker-compose build backend`.
2. Restart the stack: `docker-compose up -d`.
3. Trigger a test execution via the API.
4. Verify that `temp-test.spec.js` executes successfully and returns JSON results without browser-related errors.
