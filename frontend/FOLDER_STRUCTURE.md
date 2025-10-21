# Frontend Folder Structure

This document outlines the organized folder structure for the photography portfolio frontend.

## Structure Overview

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components (Button, Modal, etc.)
│   ├── layout/          # Layout components (Header, Footer, Sidebar)
│   ├── forms/           # Form-specific components
│   └── index.ts         # Component exports
├── pages/               # Page components/views
│   ├── HomePage.tsx
│   ├── GalleryPage.tsx
│   ├── AboutPage.tsx
│   ├── ContactPage.tsx
│   ├── LoginPage.tsx
│   ├── Dashboard.tsx
│   └── index.ts         # Page exports
├── hooks/               # Custom React hooks
│   ├── use-mobile.tsx
│   ├── use-toast.ts
│   └── index.ts
├── services/            # API calls and external services
│   ├── api.ts
│   └── index.ts
├── utils/               # Helper functions and utilities
│   ├── utils.ts
│   ├── imageUtils.ts
│   └── index.ts
├── constants/           # App constants and configuration
│   └── index.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── context/             # React context providers
│   ├── AuthContext.tsx
│   └── index.ts
├── styles/              # Global styles and themes
│   └── globals.css
├── assets/              # Static assets
│   ├── images/
│   └── *.jpg
├── routes/              # Routing configuration
│   ├── AppRouter.tsx
│   └── index.ts
├── config/              # Configuration files
│   └── env.ts
├── App.tsx              # Main App component
├── main.tsx             # Application entry point
└── vite-env.d.ts        # Vite type definitions
```

## Key Principles

### 1. **Separation of Concerns**
- **Components**: Reusable UI elements
- **Pages**: Route-specific views
- **Services**: External API interactions
- **Utils**: Pure helper functions
- **Hooks**: Reusable stateful logic

### 2. **Import Organization**
- Use index files for cleaner imports
- Group related exports together
- Prefer named exports for better tree-shaking

### 3. **Component Categories**
- **Common**: Generic, reusable components (Button, Modal, Input)
- **Layout**: Structure components (Navigation, Header, Footer)
- **Forms**: Form-specific components and validation

### 4. **File Naming Conventions**
- **Components**: PascalCase (e.g., `HomePage.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `use-mobile.tsx`)
- **Utils**: camelCase (e.g., `imageUtils.ts`)
- **Constants**: camelCase (e.g., `apiEndpoints.ts`)

## Import Examples

### Clean imports using index files:
```typescript
// Instead of multiple imports
import HomePage from '@/pages/HomePage';
import GalleryPage from '@/pages/GalleryPage';
import AboutPage from '@/pages/AboutPage';

// Use grouped imports
import { HomePage, GalleryPage, AboutPage } from '@/pages';
```

### Component imports:
```typescript
import { Button, Modal, Input } from '@/components/common';
import { Navigation, Header } from '@/components/layout';
```

### Service and utility imports:
```typescript
import { api } from '@/services';
import { formatDate, validateEmail } from '@/utils';
import { API_ENDPOINTS } from '@/constants';
```

## Migration Benefits

1. **Better Organization**: Clear separation of concerns
2. **Easier Navigation**: Logical folder grouping
3. **Improved Maintainability**: Consistent structure
4. **Better Developer Experience**: Cleaner imports
5. **Scalability**: Easy to add new features
6. **Team Collaboration**: Predictable file locations

## Next Steps

1. Update all import statements to use new paths
2. Add proper TypeScript types where missing
3. Create additional index files as needed
4. Consider adding feature-specific folders for larger components
5. Implement proper error boundaries and loading states
