# API Documentation

This file describes the current API routes for the Imarika Foundation project.
The backend is implemented in `backend/imarikapp/urls.py` and `backend/accounts/urls.py`.

## Authentication endpoints

- `POST /api/token/` — obtain access and refresh JWT tokens
- `POST /api/token/refresh/` — refresh JWT token
- `GET /api/is-superuser/` — verify whether authenticated user is a superuser

## Main resource endpoints

The following endpoints are provided by the Django REST router in `imarikapp/urls.py`.
Most are accessible via standard REST operations (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) depending on the viewset and permissions.

- `GET /api/articles/` — list articles
- `GET /api/articles/{id}/` — retrieve a single article
- `POST /api/articles/` — create an article
- `PUT /api/articles/{id}/` — update an article
- `DELETE /api/articles/{id}/` — delete an article

- `GET /api/testimonials/` — list testimonials
- `GET /api/testimonials/{id}/` — retrieve a testimonial
- `POST /api/testimonials/` — submit a testimonial
- `PUT /api/testimonials/{id}/` — update a testimonial
- `DELETE /api/testimonials/{id}/` — delete a testimonial

- `GET /api/leadership/` — list leadership profiles
- `GET /api/leadership/{id}/` — retrieve a leadership profile
- `POST /api/leadership/` — create a leadership profile
- `PUT /api/leadership/{id}/` — update a leadership profile
- `DELETE /api/leadership/{id}/` — delete a leadership profile

- `GET /api/contact/` — list contact messages (admin only)
- `POST /api/contact/` — submit a contact message

- `GET /api/admin/programs/` — list programs
- `POST /api/admin/programs/` — create a program
- `GET /api/admin/programs/{id}/` — retrieve a program
- `PUT /api/admin/programs/{id}/` — update a program
- `DELETE /api/admin/programs/{id}/` — delete a program

- `GET /api/admin/bigstats/` — list big statistics
- `GET /api/admin/pillarstats/` — list pillar stats
- `GET /api/admin/stories/` — list success stories
- `GET /api/admin/reports/` — list reports

## Additional endpoints

- `GET /api/impact-data/` — retrieve structured impact data
- `GET /api/programs-data/` — retrieve grouped programs data by pillar

- `GET /events/upcoming/` — upcoming events
- `GET /events/past/` — past events
- `POST /events/create-with-images/` — create an event with file uploads
- `PUT /events/{id}/` — update an event with image uploads
- `DELETE /events/{id}/` — delete an event

- `POST /submit/volunteer/` — submit volunteer interest
- `POST /submit/partner/` — submit partner information
- `POST /submit/donate/` — submit donation data

## Permissions summary

- `AllowAny` is applied to public pages, event listings, leader profiles, testimonials, impact data, programs, and submission forms.
- `ContactMessageViewSet` is restricted to `IsAdminUser`.
- Some admin endpoints are currently set to permissive access for development. Review and tighten permissions before production.

## Routing notes

The current Django URLs include the application routes both at the project root and under `/api/`.
That means the API may be reachable with both `/api/...` and `/api/api/...` depending on the deployment and route nesting.

## Production host

- In production, the frontend and backend are deployed on Safaricom domains.
- Make sure the deployed React app is configured to request the API from the Safaricom backend domain, and not the default local development URL.

## Example requests

### Get articles

```bash
curl http://127.0.0.1:8000/api/articles/
```

### Submit a volunteer form

```bash
curl -X POST http://127.0.0.1:8000/submit/volunteer/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe", "email": "jane@example.com", "message": "I want to help."}'
```

### Create an event with images

```bash
curl -X POST http://127.0.0.1:8000/events/create-with-images/ \
  -F "title=Community Day" \
  -F "event_date=2026-12-01" \
  -F "images=@event1.jpg" \
  -F "images=@event2.png"
```
