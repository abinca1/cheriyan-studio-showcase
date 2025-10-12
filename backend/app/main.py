from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.routers import auth, images, categories, testimonials, hero_slides

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Cheriyan Studio Showcase API"
)

# Set up CORS - Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(images.router, prefix="/api/images", tags=["images"])
app.include_router(categories.router, prefix="/api/categories", tags=["categories"])
app.include_router(testimonials.router, prefix="/api/testimonials", tags=["testimonials"])
app.include_router(hero_slides.router, prefix="/api/hero-slides", tags=["hero-slides"])

@app.get("/")
async def root():
    return {"message": "Welcome to Cheriyan Studio Showcase API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
