FROM mcr.microsoft.com/playwright:v1.60.0-noble AS runner

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including @playwright/test from devDependencies)
RUN npm install

# Install only Chromium and its system dependencies
RUN npx playwright install chromium --with-deps

# Copy app source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Environment variables
ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

# Run migrations and start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
