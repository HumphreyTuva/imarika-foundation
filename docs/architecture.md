# Deployment Architecture

## Frontend

- React Application
- Built with the code in `frontend/src/`
- Consumes backend API endpoints for dynamic content, forms, events, and impact data

## Backend

- Django REST API
- Implemented in `backend/imarika/` and `backend/imarikapp/`
- Uses Django REST Framework for viewsets, serializers, and API endpoints
- Authentication uses JWT with `rest_framework_simplejwt`

## Database

- PostgreSQL for production
- Use a managed PostgreSQL instance or configured database service in production

## Hosting

- Safaricom Domains Hosting
- Both frontend and backend are hosted on Safaricom-managed domains

## Domain

- https://imarikafoundation.org

## Architecture summary

- The React frontend connects to the Django REST backend through JSON API calls
- The backend persists data in PostgreSQL
- Static files and media are served using Django/static hosting infrastructure in production
- The deployed application is available on the Safaricom domain above
