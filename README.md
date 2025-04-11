# User Service with API Gateway

This service acts as an API Gateway for routing requests to various microservices while providing authentication, rate limiting, and logging features.

## Features

- Request routing to other services
- Request validation
- Rate limiting
- Request/Response logging
- Error handling
- Security headers (Helmet)
- CORS support

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
NODE_ENV=development

# Service URLs
PRODUCT_SERVICE_URL=http://localhost:3001
ORDER_SERVICE_URL=http://localhost:3002
PAYMENT_SERVICE_URL=http://localhost:3003

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

3. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Routes

The service will proxy requests to the following services:

- Product Service: `/api/product/*`
- Order Service: `/api/order/*`
- Payment Service: `/api/payment/*`

## Logging

Logs are stored in:
- `error.log`: Error logs
- `combined.log`: All logs

## Rate Limiting

The service implements rate limiting with the following defaults:
- Window: 15 minutes
- Maximum requests: 100 per window

## Error Handling

The service provides consistent error responses in the format:
```json
{
  "success": false,
  "message": "Error message"
}
``` 