# Company Directory Project Plan

## Overview
This project will create a company directory for Turkish companies with the following requirements:
- Framework: Vite + Vanilla JavaScript (no external packages)
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
│   │   ├── CompanyCard.js
│   │   ├── CompanyForm.js
│   │   └── Modal.js
│   ├── pages/
│   │   ├── index.html
│   │   ├── admin.html
│   │   ├── profile.html
│   │   └── login.html
│   ├── services/
│   │   ├── firebase.js
│   │   ├── api.js
│   │   └── cache.js
│   ├── styles/
│   │   ├── main.css
│   │   └── admin.css
│   ├── utils/
│   │   ├── validators.js
│   │   ├── formatter.js
│   │   └── version.js
│   ├── assets/
│   └── app.js
├── public/
│   └── index.html
├── vite.config.js
├── package.json
├── firebase.json
├── .gitignore
└── README.md
```

## Implementation Phases

### Phase 1: Project Setup
1. Initialize Vite project with Vanilla JS template
2. Configure Firebase services
3. Set up file structure

### Phase 2: Core Functionality
1. Firebase Auth system (login/logout/admin access)
2. Firestore database structure for companies
3. API service for CRUD operations
4. Company listing interface ( Turkish UI )

### Phase 3: Admin Panel
1. Data entry form with validation
2. Company list management
3. Version control integration

### Phase 4: Versioning System
1. Version management in Firestore
2. Cache clearing mechanism
3. Automatic reload on version change

## Technical Details

### Database Structure (Firestore)
```javascript
collections: {
  companies: {
    id: string,
    name: string, // Turkish
    phone: string,
    whatsapp: string,
    instagram: string,
    twitter: string,
    address: string, // Turkish
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
  }
}
```

### Version Logic
- Increment version number on any data change
- Store current version in Firestore
- Compare with cached version on page load
- Clear localStorage and reload if version changed

### Rules Documentation
- firestore.rules.md: Data access controls
- auth.rules.md: Authentication rules
- storage.rules.md: File upload rules (if needed)

## Next Steps
1. Create project structure
2. Initialize Vite
3. Set up Firebase
4. Implement Auth
5. Create Company CRUD
6. Build Admin Interface
7. Implement Versioning
8. Add Documentation

## Files to Create
- All HTML templates with Turkish interface
- Vanilla JS for all functionality
- Firebase security rules in MD format
- Integration between all components
