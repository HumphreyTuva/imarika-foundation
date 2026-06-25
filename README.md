# Imarika Foundation

Imarika Foundation is a community platform built with a React frontend and a Django REST backend.
The repository includes the public website, a Django API, mobile-friendly content pages, admin management pages, and submission forms for volunteers, partners, donations, and contact messages.

## Repository Structure

- `backend/` — Django REST API, admin panel, authentication, models, and media handling
- `frontend/` — React application, pages, components, Axios API integration, and build output
- `docs/` — documentation for API usage, architecture, and deployment

## Core Stack

- Frontend: React, React Router, Axios, Tailwind CSS
- Backend: Django, Django REST framework, Simple JWT, SQLite (development)
- Database: SQLite by default, easily upgradeable to PostgreSQL for production
- Static/media: Django `STATIC_ROOT`/`MEDIA_ROOT`

## Quick start

### Backend

```powershell
cd backend
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/`.

### Frontend

```powershell
cd frontend
npm install
npm start
```

The React app will run at `http://localhost:3000/` by default.

## Production build

```powershell
cd frontend
npm run build
```

Then deploy the generated `frontend/build` files to a web server or integrate them with a Django static file deployment.

## Production hosting

- Frontend and backend are hosted on Safaricom-managed domains.
- Configure the React app and API base URLs to use the deployed Safaricom production domains instead of localhost.

## Documentation

- `docs/api-documentation.md` — API endpoints and authentication details
- `docs/architecture.md` — system architecture and component overview
- `docs/deployment.md` — deployment recommendations and production setup

## Notes

- The backend currently uses SQLite for development. For production, configure PostgreSQL or another robust database.
- `backend/imarika/settings.py` sets `DEBUG = True`. Set `DEBUG = False` before deploying.
- `CORS_ALLOWED_ORIGINS` currently allows `http://localhost:3000`.
- Some admin-like endpoints are currently configured with broad permissions and should be restricted before going live.
