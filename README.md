# DevTrack
DevTrack is a full-stack project collaboration and task management platform built with **React + TypeScript** on the frontend and **ASP.NET Core Web API** on the backend. It allows users to register, log in with JWT authentication, create and manage their own projects, add tasks, update task status, edit content, search and filter tasks, and view task progress through a dashboard.

## Overview
The goal of DevTrack is to provide a clean and practical project tracking system with secure user-based access control and a modern dashboard-style interface. The application demonstrates full-stack CRUD workflows, authentication, authorization, API integration, relational data handling, and UI state management.

## Features
- User registration and login with **JWT authentication**
- Secure **owner-based authorization** for projects and tasks
- Create, view, update, and delete projects
- Create, view, update, and delete tasks
- Update task status: **Todo / In Progress / Done**
- Task filtering by status
- Task search by title or description
- Dashboard summary cards for:
  - total projects
  - total tasks
  - todo tasks
  - completed tasks
- Dashboard visualizations:
  - task status progress bar
  - status distribution chart
- Project detail page with task management workflow
- Clean responsive UI for portfolio/demo presentation

## Tech Stack
### Frontend
- React
- TypeScript
- Vite
- React Router
- CSS
### Backend
- ASP.NET Core Web API
- C#
- Entity Framework Core
- SQLite
- JWT Bearer Authentication
- BCrypt password hashing

## Project Structure
```text
DevTrack/
├── DevTrack.Api/
│   ├── Controllers/
│   ├── DTOs/
│   ├── Data/
│   ├── Models/
│   ├── Migrations/
│   ├── Program.cs
│   └── appsettings.json
│
├── devtrack-client/
│   ├── src/
│   │   ├── api/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```
## Key Implementation Highlights
### Authentication and Authorization
Implemented user registration and login with JWT-based authentication
Stored hashed passwords using BCrypt
Protected backend endpoints with [Authorize]
Restricted project and task access to the authenticated owner only
### Project and Task Management
Built complete CRUD flows for projects and tasks
Linked tasks to projects using relational data models
Added edit functionality for both projects and tasks
Added task status updates and task deletion
### Dashboard and UI
Designed a dashboard with summary cards and visual indicators
Implemented task status visualization with a progress bar and chart
Added task filter and search for better task tracking
Structured the UI into reusable page sections with a modern card-based layout

## Database Design
The backend uses SQLite with Entity Framework Core for data persistence.

Main entities:
User
Project
TaskItem

Relationships:
One user can own many projects
One project can contain many tasks

## API Summary
### Auth
POST /api/auth/register
POST /api/auth/login
### Projects
GET /api/projects
GET /api/projects/{id}
POST /api/projects
PUT /api/projects/{id}
DELETE /api/projects/{id}
### Tasks
POST /api/tasks
PUT /api/tasks/{id}
PATCH /api/tasks/{id}/status
DELETE /api/tasks/{id}

## How to Run Locally
### 1. Clone the repository
```Bash
git clone https://github.com/EdnaZhang-743/DevTrack.git
cd DevTrack
```
### 2. Run the backend
```Bash
cd DevTrack.Api
dotnet ef database update
dotnet run --urls=http://localhost:5000
```
### 3. Run the frontend
Open a new terminal:
```Bash
cd devtrack-client
npm install
npm run dev
```
### 4. Open in browser
Frontend: http://localhost:5173
Backend Swagger: http://localhost:5000/swagger

## Future Improvements
Add due date support and deadline reminders
Add user profile and account settings
Add team collaboration and multi-user project sharing
Add pagination and sorting for larger datasets
Improve dashboard charts with a charting library
Add automated tests for frontend and backend workflows

## What I Learned

Through this project, I strengthened my understanding of:

full-stack application architecture
JWT authentication flow
owner-based authorization logic
REST API design in ASP.NET Core
Entity Framework Core data modeling and migrations
React state management and page routing
building a clean dashboard UI for real-world project presentation
