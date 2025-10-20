# New Features Added

This document describes the new features added to the Cheriyan Studio Showcase API.

## 1. Business Hours Management

### Overview
Admin can now manage business hours for each day of the week through the API.

### API Endpoints
- `GET /api/business-hours/` - Get all business hours
- `GET /api/business-hours/{day_of_week}` - Get business hours for a specific day
- `POST /api/business-hours/` - Create business hours (Admin only)
- `PUT /api/business-hours/{day_of_week}` - Update business hours (Admin only)
- `DELETE /api/business-hours/{day_of_week}` - Delete business hours (Admin only)

### Default Business Hours
- **Monday - Friday**: 9:00 AM - 6:00 PM
- **Saturday**: 10:00 AM - 4:00 PM
- **Sunday**: By Appointment Only

### Database Schema
```sql
CREATE TABLE business_hours (
    id INTEGER PRIMARY KEY,
    day_of_week VARCHAR NOT NULL UNIQUE,
    is_open BOOLEAN DEFAULT TRUE,
    open_time VARCHAR,
    close_time VARCHAR,
    is_by_appointment BOOLEAN DEFAULT FALSE,
    notes VARCHAR,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);
```

## 2. Contact Details Management

### Overview
Admin can now manage contact information (email, phone, address) through the API.

### API Endpoints
- `GET /api/contact-details/` - Get all contact details
- `GET /api/contact-details/{contact_id}` - Get specific contact detail
- `POST /api/contact-details/` - Create contact details (Admin only)
- `PUT /api/contact-details/{contact_id}` - Update contact details (Admin only)
- `DELETE /api/contact-details/{contact_id}` - Delete contact details (Admin only)

### Database Schema
```sql
CREATE TABLE contact_details (
    id INTEGER PRIMARY KEY,
    email VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,
    address VARCHAR NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);
```

## 3. Profile Picture Support for Images

### Overview
Images can now be marked as profile pictures using the `is_profile_picture` boolean field.

### Changes Made
- Added `is_profile_picture` field to Image model
- Updated image schemas to include the new field
- Updated image upload API to accept `is_profile_picture` parameter
- Updated image update API to handle the new field

### API Usage
When uploading an image, you can now specify:
```
POST /api/images/
Form data:
- file: [image file]
- title: "Profile Picture"
- is_profile_picture: true
- ... other fields
```

## Installation and Setup

### 1. Run Database Migration
```bash
cd backend
python migrate_new_features.py
```

### 2. Initialize Business Hours (Optional)
If you want to set up default business hours:
```bash
python init_business_hours.py
```

### 3. Start the Server
```bash
python start.py
```

## API Examples

### Get Business Hours
```bash
curl -X GET "http://localhost:8000/api/business-hours/"
```

### Update Business Hours for Monday
```bash
curl -X PUT "http://localhost:8000/api/business-hours/Monday" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "is_open": true,
    "open_time": "09:00",
    "close_time": "18:00"
  }'
```

### Create Contact Details
```bash
curl -X POST "http://localhost:8000/api/contact-details/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "contact@cheriyanstudio.com",
    "phone": "+1-555-123-4567",
    "address": "123 Photography St, City, State 12345"
  }'
```

### Upload Profile Picture
```bash
curl -X POST "http://localhost:8000/api/images/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@profile.jpg" \
  -F "title=Profile Picture" \
  -F "is_profile_picture=true"
```

## Database Models

### BusinessHours Model
```python
class BusinessHours(Base):
    __tablename__ = "business_hours"
    
    id = Column(Integer, primary_key=True, index=True)
    day_of_week = Column(String, nullable=False, unique=True)
    is_open = Column(Boolean, default=True)
    open_time = Column(String)
    close_time = Column(String)
    is_by_appointment = Column(Boolean, default=False)
    notes = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

### ContactDetails Model
```python
class ContactDetails(Base):
    __tablename__ = "contact_details"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    address = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

## Notes

- All new endpoints require authentication (Admin only for write operations)
- Business hours are stored per day of the week
- Contact details are stored as a single record (only one set of contact details)
- Profile pictures are marked using the `is_profile_picture` boolean field on images
- All timestamps are stored in UTC
- The migration script is idempotent and can be run multiple times safely
