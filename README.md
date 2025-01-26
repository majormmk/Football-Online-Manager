# Football Online Manager Web App

A web application for managing football teams and player transfers. Users can create teams, manage players, and participate in the transfer market.

## Features

- User Authentication (Register/Login)
- Team Management
- Transfer Market

### Frontend
- React
- Ant Design UI Framework
- Axios for API calls

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication

## Setup Instructions

1. Clone the repository
2. Install dependencies for both frontend and backend (npm install)
3. Run (node -e "console.log(require('crypto').randomBytes(64).toString('hex'))") to generate a secret key.
4. Create a .env file in the backend directory and add the following:
    - JWT_SECRET="<generated secret key>"
    - DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiOWMxNTIxNTAtYmQ1MS00NDg5LTk5ZmYtOTIxYWM2YmQzZjQ3IiwidGVuYW50X2lkIjoiOTM1OTUxMThmYjcyMWY2OWNmMzlmYzZmZDc3MGQ4ZTM2NjA0ZjJkMzc3MzcwNzkzMjBiNmQyN2Y3MDM1MmRmZSIsImludGVybmFsX3NlY3JldCI6ImEyZWRlOTlkLTdiYzMtNGEwNS05MWIyLTg3NWUwM2I0YzBmNiJ9.Xu3jrVCl8qXPOPdXGPJ3tRDHqJ1juRSWB_Qcv4ZHA-I"
    - PULSE_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiOWMxNTIxNTAtYmQ1MS00NDg5LTk5ZmYtOTIxYWM2YmQzZjQ3IiwidGVuYW50X2lkIjoiOTM1OTUxMThmYjcyMWY2OWNmMzlmYzZmZDc3MGQ4ZTM2NjA0ZjJkMzc3MzcwNzkzMjBiNmQyN2Y3MDM1MmRmZSIsImludGVybmFsX3NlY3JldCI6ImEyZWRlOTlkLTdiYzMtNGEwNS05MWIyLTg3NWUwM2I0YzBmNiJ9.Xu3jrVCl8qXPOPdXGPJ3tRDHqJ1juRSWB_Qcv4ZHA-I"
5. Set up the database and configure Prisma (npx prisma migrate dev)
6. Run the application (npm run dev for frontend and npm start for backend)

## Time Report

### Backend Development (20 hours in total)
- Initial Setup & Project Structure (2 hours)
- Database Schema Design (3 hours)
- Authentication System (4 hours)
- Team Management API (5 hours)
- Transfer Market API (6 hours)
- Testing & Debugging (4 hours)

### Frontend Development (26 hours in total)
- Project Setup & Configuration (2 hours)
- Authentication Pages (4 hours)
- Team Management Interface (6 hours)
- Transfer Market Interface (6 hours)
- UI/UX Improvements (4 hours)
- Testing & Bug Fixes (4 hours)

### Integration & Testing (12 hours in total)
- API Integration (4 hours)
- End-to-End Testing (3 hours)
- Bug Fixes & Improvements (5 hours)

### Documentation (1 hour)

### Total Time: 59 hours

