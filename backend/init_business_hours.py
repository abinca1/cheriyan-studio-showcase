#!/usr/bin/env python3
"""
Initialize business hours with default values
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal
from app.models.business_hours import BusinessHours

def init_business_hours():
    """Initialize business hours with default values"""
    db = SessionLocal()
    
    try:
        # Check if business hours already exist
        existing = db.query(BusinessHours).first()
        if existing:
            print("Business hours already exist. Skipping initialization.")
            return
        
        # Default business hours
        business_hours_data = [
            {
                "day_of_week": "Monday",
                "is_open": True,
                "open_time": "09:00",
                "close_time": "18:00",
                "is_by_appointment": False,
                "notes": None
            },
            {
                "day_of_week": "Tuesday", 
                "is_open": True,
                "open_time": "09:00",
                "close_time": "18:00",
                "is_by_appointment": False,
                "notes": None
            },
            {
                "day_of_week": "Wednesday",
                "is_open": True,
                "open_time": "09:00",
                "close_time": "18:00",
                "is_by_appointment": False,
                "notes": None
            },
            {
                "day_of_week": "Thursday",
                "is_open": True,
                "open_time": "09:00",
                "close_time": "18:00",
                "is_by_appointment": False,
                "notes": None
            },
            {
                "day_of_week": "Friday",
                "is_open": True,
                "open_time": "09:00",
                "close_time": "18:00",
                "is_by_appointment": False,
                "notes": None
            },
            {
                "day_of_week": "Saturday",
                "is_open": True,
                "open_time": "10:00",
                "close_time": "16:00",
                "is_by_appointment": False,
                "notes": None
            },
            {
                "day_of_week": "Sunday",
                "is_open": False,
                "open_time": None,
                "close_time": None,
                "is_by_appointment": True,
                "notes": "By Appointment Only"
            }
        ]
        
        # Create business hours records
        for data in business_hours_data:
            business_hours = BusinessHours(**data)
            db.add(business_hours)
        
        db.commit()
        print("Business hours initialized successfully!")
        
    except Exception as e:
        print(f"Error initializing business hours: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_business_hours()
