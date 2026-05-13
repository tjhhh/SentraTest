# Docker Secrets Setup untuk Production

Setup ini menggunakan Docker secrets untuk menyimpan data sensitif secara aman.

## Struktur Files

```
secrets/
├── jwt_access_secret.txt     # JWT access token secret
├── jwt_refresh_secret.txt    # JWT refresh token secret
└── gemini_api_key.txt        # Gemini AI API key

docker-compose.prod.yml       # Production compose file dengan secrets
backend/.env.production       # Template environment variables
```

## Setup Production

### 1. Edit Secrets Files

Update file-file di direktori `secrets/` dengan nilai production yang sebenarnya:

```bash
# Edit secrets dengan nilai yang benar
echo "your-actual-jwt-access-secret-32-chars" > secrets/jwt_access_secret.txt
echo "your-actual-jwt-refresh-secret-32-chars" > secrets/jwt_refresh_secret.txt
echo "your-actual-gemini-api-key" > secrets/gemini_api_key.txt
```

### 2. Set Environment Variables

Buat file `.env.prod` atau export variables:

```bash
export POSTGRES_USER=prod_user
export POSTGRES_PASSWORD=prod_password
export POSTGRES_DB=sentra_prod
export POSTGRES_PORT=5436
export CORS_ORIGINS=https://yourdomain.com
export NEXT_PUBLIC_API_URL=https://your-api-domain.com
export GEMINI_MODEL=gemini-2.0-flash-exp
```

### 3. Build dan Run Production

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Run production stack
docker-compose -f docker-compose.prod.yml up -d
```

## Keamanan

- ✅ Secrets tidak pernah masuk ke Docker image
- ✅ Secrets dienkripsi di Docker daemon
- ✅ Secrets hanya tersedia saat runtime
- ✅ Tidak terlihat di `docker history` atau `docker inspect`

## Troubleshooting

### Secrets tidak terbaca:
- Pastikan file secrets ada di `./secrets/`
- Pastikan Docker Compose menggunakan file yang benar
- Check logs: `docker-compose -f docker-compose.prod.yml logs backend`

### Environment variables tidak override:
- Pastikan `NODE_ENV=production` di set
- Check bahwa secrets utility function berjalan dengan benar

## Development vs Production

- **Development**: Menggunakan `.env` file dan environment variables
- **Production**: Menggunakan Docker secrets + environment variables untuk non-sensitive data