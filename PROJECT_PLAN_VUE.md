# Vue.js Company Directory Project Plan

## Overview
This project will create a company directory for Turkish companies using Vue.js with the following requirements:
- Framework: Vite + Vue.js (no external packages)
- Backend: Firebase (Hosting, Auth, Firestore)
- Interface: Turkish UI, English files
- Admin panel for data management
- Versioning system with cache clearing

## Project Structure
```
/data/home/appRehber/
├── docs/
│   ├── rules/
│   │   ├── firestore.rules.md
│   │   ├── auth.rules.md
│   │   └── storage.rules.md
│   └── agents.md
├── src/
│   ├── components/
│   │   ├── CompanyCard.vue
│   │   ├── CompanyForm.vue
│   │   ├── Modal.vue
│   │   └── LoadingSpinner.vue
│   ├── views/
│   │   ├── HomeView.vue
│   │   ├── AdminView.vue
│   │   ├── ProfileView.vue
│   │   └── LoginView.vue
│   ├── services/
│   │   ├── firebase.js
│   │   ├── api.js
│   │   └── cache.js
│   ├── stores/
│   │   └── index.js
│   ├── router/
│   │   └── index.js
│   ├── assets/
│   │   ├── styles/
│   │   │   ├── main.css
│   │   │   └── admin.css
│   │   └── images/
│   ├── App.vue
│   └── main.js
├── public/
│   └── index.html
├── vite.config.js
├── package.json
├── firebase.json
├── .gitignore
└── README.md
```

## Implementation Plan

### Phase 1: Project Setup
1. Initialize Vue.js Vite project
2. Configure Vue Router
3. Set up Pinia store (if needed) or Vuex
4. Configure Firebase services

### Phase 2: Core Components
1. CompanyCard.vue - Display company information
2. CompanyForm.vue - Form for data entry/edit
3. Modal.vue - For confirmations and messages
4. LoadingSpinner.vue - Loading states

### Phase 3: Views/Pages
1. HomeView.vue - Public company directory
2. AdminView.vue - Admin dashboard with data management
3. ProfileView.vue - User profile page
4. LoginView.vue - Authentication page

### Phase 4: Services
1. Firebase configuration and initialization
2. API service for Firestore CRUD operations
3. Cache management for versioning
4. Auth service for user management

### Phase 5: Versioning System
- Firestore collection for version tracking
- Local storage version comparison
- Cache clearing and reload mechanism
- Version increment on data changes

## Database Structure (Firestore)
```javascript
collections: {
  companies: {
    id: string,
    name: string, // Turkish company name
    phone: string,
    whatsapp: string,
    instagram: string,
    twitter: string,
    address: string, // Turkish address
    location: {
      lat: number,
      lng: number
    },
    createdAt: timestamp,
    updatedAt: timestamp,
    version: number
  },
  versions: {
    currentVersion: number,
    lastUpdate: timestamp,
    cacheTimestamp: timestamp
  },
  users: {
    id: string,
    email: string,
    name: string,
    role: 'admin' | 'user'
  }
}
```

## Vue.js Features
- Reactive company list display
- Form validation with custom validators
- Modal confirmations
- Loading states
- Router guards for authentication
- Responsive design with CSS Grid/Flexbox
- Turkish localization in components

## Documentation Requirements
- Create MD files under docs/rules/
- Add references to agents.md
- Document Vue.js structure and components
- Document Firebase integration

## Next Steps
1. Initialize Vue.js project with Vite
2. Set up router and store
3. Create Firebase configuration
4. Implement Auth system
5. Build Company CRUD components
6. Create Admin interface
7. Implement Versioning logic
8. Add Documentation

## Turkish Interface Implementation
- All UI text in Turkish
- Number formatting for phone/WhatsApp
- Social media share buttons with Turkish labels
- Location display in Turkish format
- Toast notifications in Turkish
- Form validation messages in Turkish

## Security Rules (MD Format)
- firestore.rules.md: Data read/write permissions
- auth.rules.md: Authentication and user management
- storage.rules.md: File upload restrictions
- agents.md: Project overview and integration guide
