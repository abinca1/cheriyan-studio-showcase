// Application constants
export const APP_NAME = "Photography by Cheriyan";
export const APP_DESCRIPTION = "Professional photography services specializing in fashion, weddings, portraits, and product photography";

export const CONTACT_INFO = {
  email: "hello@cheriyan.photography",
  phone: "+1 (555) 123-4567",
  address: "123 Photography Lane, Creative City, CC 12345",
};

export const BUSINESS_HOURS = {
  weekdays: "Monday - Friday: 9:00 AM - 6:00 PM",
  saturday: "Saturday: 10:00 AM - 4:00 PM",
  sunday: "Sunday: By Appointment Only",
};

export const NAVIGATION_LINKS = [
  { name: "Home", path: "/" },
  { name: "Gallery", path: "/gallery" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export const GALLERY_CATEGORIES = ["All", "Fashion", "Wedding", "Portrait", "Product"] as const;
