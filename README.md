# BookFlix - Movie Booking System

A full-stack movie booking application built with NestJS and React.

## Prerequisites

- Node.js
- PostgreSQL (running on localhost:5432)

## Setup & Run

### 1. Backend (NestJS)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment:
   - Ensure PostgreSQL is running.
   - Create a database named `bookflix`.
   - The `.env` file is already created with default credentials (postgres/postgres). Update if needed.

4. Start the server:
   ```bash
   npm run start:dev
   ```
   The backend will run on `http://localhost:3000`.

### 2. Frontend (React + Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

## Features

- **User Auth**: Register, Login (JWT).
- **Movies**: View latest movies.
- **Booking**: Select seats and book tickets (Transaction based).
- **Admin**: Add movies, theaters, and shows.
- **Profile**: View booking history.

## Tech Stack

- **Backend**: NestJS, TypeORM, PostgreSQL, Passport JWT.
- **Frontend**: React, TypeScript, Tailwind CSS, Axios, React Router.
