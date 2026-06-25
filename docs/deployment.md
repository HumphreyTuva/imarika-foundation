# Deployment

This document describes deployment steps and recommendations for the Imarika Foundation project.

## Backend deployment

1. Clone the repository and install Python dependencies:

```powershell
cd backend
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2. Configure environment variables for production:

- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG=False`
- `ALLOWED_HOSTS` set to your domain or hostnames
- `DATABASES` updated for PostgreSQL or another production database

3. Apply migrations:

```powershell
python manage.py migrate
```

4. Collect static files:

```powershell
python manage.py collectstatic
```

5. Start the application with a production-ready WSGI server such as Gunicorn or Daphne.

## Frontend deployment

1. Build the React application:

```powershell
cd frontend
npm install
npm run build
```

2. Deploy the generated `frontend/build` files to a static hosting provider or integrate them into a Django static file workflow.

3. Update the frontend configuration to point to the Safaricom backend API domain.

4. Ensure the production `CORS_ALLOWED_ORIGINS` list in `backend/imarika/settings.py` includes the Safaricom frontend domain.

## Static and media

- `STATIC_ROOT` is set to `backend/staticfiles`
- `MEDIA_ROOT` is set to `backend/media`
- In production, configure your web server to serve `/static/` and `/media/` directly

## Database recommendations

- SQLite is fine for development, but use PostgreSQL or another production database for reliability
- Example Django database configuration for PostgreSQL:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': '<db_name>',
        'USER': '<db_user>',
        'PASSWORD': '<db_password>',
        'HOST': '<db_host>',
        'PORT': 5432,
    }
}
```

## Security reminders

- Set `DEBUG=False` in `backend/imarika/settings.py`
- Serve the `SECRET_KEY` from a secure environment variable instead of hardcoding it
- Restrict admin and sensitive endpoints with appropriate authentication and permission classes
- Review `CORS_ALLOWED_ORIGINS` to include only trusted frontend hosts

## Notes

The current project structure is ready for a standard Django deployment. If you want to host the frontend separately, use the React production build and point it to the API base URL.
