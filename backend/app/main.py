from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
from starlette.responses import JSONResponse
from starlette import status as http_status

from app.core.config import settings
from app.routers import auth, images, categories, testimonials, hero_slides, social_media, business_hours, contact_details
from app.utils.api_response import error_response

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Cheriyan Studio Showcase API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Global exception handlers for unified error envelope
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    field_errors = {}
    for err in exc.errors():
        loc = ".".join([str(p) for p in err.get("loc", []) if p != "body"]) or "body"
        field_errors.setdefault(loc, []).append(err.get("msg", "Invalid value"))
    return error_response(
        status=http_status.HTTP_422_UNPROCESSABLE_ENTITY,
        code="INPUT_VALIDATION_FAILED",
        description="Validation failed for one or more fields.",
        message="Some fields are invalid.",
        fields=field_errors,
    )

@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return error_response(
        status=http_status.HTTP_404_NOT_FOUND,
        code="RESOURCE_NOT_FOUND",
        description="The requested resource was not found.",
        message="We couldn’t find what you’re looking for.",
    )

# Catch-all for other HTTPException to keep error envelope consistent
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    status_code = exc.status_code or http_status.HTTP_400_BAD_REQUEST
    # Best-effort error code mapping
    code_map = {
        400: "BAD_REQUEST",
        401: "UNAUTHORIZED",
        403: "FORBIDDEN",
        404: "RESOURCE_NOT_FOUND",
        405: "METHOD_NOT_ALLOWED",
        409: "CONFLICT",
        415: "UNSUPPORTED_MEDIA_TYPE",
        422: "INPUT_VALIDATION_FAILED",
        429: "RATE_LIMIT_EXCEEDED",
        500: "INTERNAL_SERVER_ERROR",
    }
    code = code_map.get(status_code, "HTTP_ERROR")
    description = exc.detail if isinstance(exc.detail, str) else "An HTTP error occurred."
    return error_response(
        status=status_code,
        code=code,
        description=description,
        message=description,
    )

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(images.router, prefix="/api/images", tags=["images"])
app.include_router(categories.router, prefix="/api/categories", tags=["categories"])
app.include_router(testimonials.router, prefix="/api/testimonials", tags=["testimonials"])
app.include_router(hero_slides.router, prefix="/api/hero-slides", tags=["hero-slides"])
app.include_router(social_media.router, prefix="/api/social-media", tags=["social-media"])
app.include_router(business_hours.router, prefix="/api/business-hours", tags=["business-hours"])
app.include_router(contact_details.router, prefix="/api/contact-details", tags=["contact-details"])

@app.get("/")
async def root():
    return {"message": "Welcome to Cheriyan Studio Showcase API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
