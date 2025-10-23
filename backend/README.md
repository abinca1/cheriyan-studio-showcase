# Cheriyan Studio Showcase - Backend API

A FastAPI-based backend for the Cheriyan Studio Showcase application, providing authentication, user management, and image gallery functionality.

## Features

- **User Authentication**: JWT-based authentication with refresh tokens
- **User Management**: User registration, login, profile management
- **Image Gallery**: Upload, manage, and display images
- **Admin Panel**: Admin user creation and management
- **File Upload**: Secure file upload with validation
- **Database**: SQLAlchemy ORM with SQLite (easily configurable for PostgreSQL/MySQL)

## Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI application entry point
│   ├── core/
│   │   └── config.py          # Application configuration
│   ├── db/
│   │   ├── base.py            # Database setup
│   │   └── session.py         # Database session management
│   ├── models/
│   │   ├── user.py            # User model
│   │   ├── image.py           # Image model
│   │   └── refresh_token.py   # Refresh token model
│   ├── schemas/
│   │   ├── user.py            # User Pydantic schemas
│   │   ├── auth.py            # Authentication schemas
│   │   └── image.py           # Image schemas
│   ├── routers/
│   │   ├── auth.py            # Authentication endpoints
│   │   └── images.py          # Image management endpoints
│   ├── services/
│   │   ├── auth_service.py    # Authentication business logic
│   │   └── image_service.py   # Image management business logic
│   ├── utils/
│   │   ├── security.py        # Password hashing utilities
│   │   └── files.py           # File handling utilities
│   ├── static/
│   │   └── images/            # Uploaded images directory
│   └── migrations/            # Database migrations (Alembic)
├── scripts/
│   └── create_admin.py        # Admin user creation script
├── .env                       # Environment variables
├── requirements.txt           # Python dependencies
└── README.md                  # This file
```

## Installation

1. **Create a virtual environment:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables:**
   - Copy `.env` file and update the values as needed
   - Generate a secure SECRET_KEY for production

4. **Create database tables and admin user:**
   ```bash
   python scripts/create_admin.py
   ```

## Running the Application

1. **Start the development server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Access the API:**
   - API: http://localhost:8000
   - Interactive API docs: http://localhost:8000/docs
   - Alternative API docs: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/change-password` - Change password

### Images
- `GET /api/images/` - Get all public images
- `GET /api/images/my-images` - Get current user's images
- `GET /api/images/{image_id}` - Get specific image
- `POST /api/images/` - Upload new image
- `PUT /api/images/{image_id}` - Update image
- `DELETE /api/images/{image_id}` - Delete image

## Configuration

Key configuration options in `.env`:

- `DATABASE_URL`: Database connection string
- `SECRET_KEY`: JWT secret key (change in production!)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Access token expiration time
- `REFRESH_TOKEN_EXPIRE_DAYS`: Refresh token expiration time
- `ALLOWED_HOSTS`: CORS allowed origins
- `UPLOAD_DIR`: Directory for uploaded files
- `MAX_FILE_SIZE`: Maximum file upload size
- `ALLOWED_EXTENSIONS`: Allowed file extensions

## Development

### Adding New Features

1. **Models**: Add new SQLAlchemy models in `app/models/`
2. **Schemas**: Add Pydantic schemas in `app/schemas/`
3. **Services**: Add business logic in `app/services/`
4. **Routers**: Add API endpoints in `app/routers/`
5. **Update main.py**: Include new routers

### Database Migrations

For production, consider using Alembic for database migrations:

```bash
# Initialize Alembic (if not already done)
alembic init alembic

# Create a migration
alembic revision --autogenerate -m "Add new table"

# Apply migrations
alembic upgrade head
```

## Security Considerations

- Change the `SECRET_KEY` in production
- Use HTTPS in production
- Configure proper CORS origins
- Implement rate limiting
- Add input validation and sanitization
- Use environment variables for sensitive data

## Deployment

For production deployment:

1. Use a production WSGI server (e.g., Gunicorn)
2. Use a production database (PostgreSQL, MySQL)
3. Configure reverse proxy (Nginx)
4. Set up SSL/TLS certificates
5. Configure environment variables securely
6. Set up monitoring and logging

Example production command:
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```
