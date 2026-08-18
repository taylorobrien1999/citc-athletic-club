<div align="center">

<img src="client/src/assets/citc-logo-full.png" alt="Calgary International Track Club" width="340" />

# CITC Athletic Club Operations System

A full stack club management platform built for the Calgary International Track Club (CITC), featuring a public website, a member portal, a full content management system, and an AI powered assistant, all deployed across a microservices architecture on Microsoft Azure.

[Live Site](https://calgaryinternational-dkb0cfa3fmg8g9bb.canadacentral-01.azurewebsites.net) &nbsp;•&nbsp;
[Report an Issue](https://github.com/taylorobrien1999/citc-athletic-club/issues)

</div>

<br>

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Team](#team)
- [License](#license)

<br>

## Overview

CITC previously operated without a proper website, relying on manual processes for membership, communication, and content updates. This project replaces that with a complete digital platform including:

- A public marketing site for programs, coaches, schedules, and club information
- A secure member portal with a personalized dashboard
- A full content management system so non-technical club administrators can update the entire site without writing code
- An AI assistant available to both public visitors and administrators
- A microservices backend, independently deployed and scaled across five separate services

This was developed as a capstone project for the SAIT Software Development diploma program in partnership with CITC.

<br>

## Key Features

**Public Website**
- Fully responsive, dark mode supported design across every page
- Dynamic content for Programs, Coaches, Track Meets, Club Records, and News, all editable through the admin dashboard
- Live embedded maps and a working contact form with real email delivery
- An AI chatbot that answers visitor questions about the club in real time

**Member Portal**
- Self service registration through an inquiry and approval workflow
- Personalized dashboard with announcements, upcoming schedule, and member only resources
- Editable profile including emergency contact information and a profile photo

**Admin Dashboard**
- Full CRUD management for Programs, Coaches, Events, Announcements, Resources, Sponsors, and Club Records
- Rich text editing across every content field, with automatic dark mode safe formatting
- Granular visibility controls, allowing content to be marked public, members only, or both
- Member management including role promotion, deactivation, and a live permission enforcement system
- A dedicated AI assistant trained specifically to help administrators use the dashboard

**Security**
- JWT based authentication with role based access control
- Live permission verification on every request, so a change to a user's role or access takes effect immediately, not just at their next login
- Server side and client side input validation across every form handling personal data

<br>

## Architecture

The backend is split into five independently deployed microservices, each with a distinct responsibility, its own deployment pipeline, and its own Azure App Service.

| Service | Responsibility |
|---|---|
| **Main Application** | Public content: Programs, Coaches, Events, Announcements, Resources, Site Content, Sponsors, and Club Records |
| **Auth & Identity Service** | Login, registration, password reset, and member management |
| **Notifications Service** | Contact form submissions, registration inquiries, and all outbound email |
| **Media Service** | File and image uploads via Cloudinary |
| **AI Chatbot Service** | Two context aware assistants: one for public and member facing questions, one dedicated to admin dashboard support |

All services share a single PostgreSQL database while remaining independently deployable, so any one service can be updated or redeployed without affecting the others.

```
                          ┌────────────────────┐
                          │   React Frontend    │
                          └──────────┬───────────┘
                                     │
        ┌───────────────┬───────────┼───────────────┬───────────────┐
        │                │           │               │               │
 ┌──────▼─────┐  ┌────────▼─────┐ ┌───▼────┐ ┌────────▼───────┐ ┌─────▼──────┐
 │ Main App    │  │ Auth Service │ │ Media  │ │ Notifications  │ │ AI Chatbot │
 │ (Content)   │  │              │ │Service │ │ Service        │ │ Service    │
 └──────┬──────┘  └───────┬──────┘ └───┬────┘ └────────┬───────┘ └─────┬──────┘
        │                 │            │               │               │
        └─────────────────┴────────────┴───────────────┴───────────────┘
                                     │
                          ┌──────────▼───────────┐
                          │  PostgreSQL Database   │
                          │       (Aiven)          │
                          └────────────────────────┘
```

<br>

## Tech Stack

**Frontend**
- React.js with React Router
- Plain CSS with a shared design system and full dark mode support
- Quill based rich text editor with custom paste sanitization

**Backend**
- Node.js with Express, split across five microservices
- Sequelize ORM over PostgreSQL, hosted on Aiven
- JWT authentication with bcrypt password hashing

**AI**
- Google Gemini API, integrated as a standalone service with two distinct, context grounded personas

**Infrastructure**
- Microsoft Azure App Service, one instance per microservice
- GitHub Actions for continuous integration and deployment, one workflow per service
- Cloudinary for image and file storage
- Nodemailer with Gmail SMTP for transactional email

<br>

## Project Structure

```
citc-athletic-club/
├── client/                    React frontend
├── server/                    Main application service (content and CMS)
├── auth-service/               Authentication and member management
├── notifications-service/      Contact form and registration inquiries
├── media-service/               File and image uploads
├── chatbot-service/             AI assistant service
└── .github/workflows/          One deployment workflow per service
```

<br>

## Getting Started

Each service runs independently and requires its own dependencies to be installed.

```bash
# Clone the repository
git clone https://github.com/taylorobrien1999/citc-athletic-club.git
cd citc-athletic-club

# Install and run the frontend
cd client
npm install
npm start

# Install and run each backend service (in separate terminals)
cd server && npm install && npm start
cd auth-service && npm install && npm start
cd notifications-service && npm install && npm start
cd media-service && npm install && npm start
cd chatbot-service && npm install && npm start
```

Each service requires its own `.env` file. See [Environment Variables](#environment-variables) below.

<br>

## Environment Variables

Every backend service shares a common set of core variables, plus a few that are service specific.

**Shared across all services**
```
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
DB_SSL=
JWT_SECRET=
CLIENT_URL=
```

**Auth and Notifications services also require**
```
GMAIL_USER=
GMAIL_APP_PASSWORD=
```

**Media service also requires**
```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**AI Chatbot service requires**
```
GEMINI_API_KEY=
```

**Frontend (`client/.env`)**
```
REACT_APP_API_URL=
REACT_APP_AUTH_API_URL=
REACT_APP_NOTIFICATIONS_API_URL=
REACT_APP_MEDIA_API_URL=
```

<br>

## Deployment

Each service deploys independently through its own GitHub Actions workflow, triggered automatically on every push to `main`. Each service is hosted on its own Azure App Service, allowing any one part of the system to be updated, scaled, or redeployed without affecting the others.

<br>

## Team

| Name | Role |
|---|---|
| Taylor O'Brien | Project Lead, AI Integration, Cloud Architecture and Deployment, Authentication and Security |
| Paras Odedara | Backend Development |
| Mayur Brahmbhatt | Frontend Development |

Developed in partnership with the **Calgary International Track Club** as a capstone project for the SAIT Software Development diploma program.

<br>

## License

This project was developed for educational purposes as part of a SAIT capstone program and for use by the Calgary International Track Club. All rights reserved.

</div>
