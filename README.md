# MedCare Plus - Hospital Appointment System

MedCare Plus is a hospital appointment management system built with React, Express.js, and MongoDB with Mongoose.

## Project Structure
- `frontend/`: React single page application with React Router.
- `backend/`: Express REST API server and Mongoose models.

## Environment Variables
Create a `.env` file in the root and/or backend directory based on `.env.example`:
- `PORT`: Server port number (default: 5000)
- `MONGO_URI`: MongoDB connection string (e.g., `mongodb://127.0.0.1:27017/medcare`)

## MongoDB Setup
1. Ensure MongoDB server is running locally or provide a MongoDB Atlas connection string in `MONGO_URI`.
2. The application connects automatically on server start and falls back gracefully to standard REST endpoints if offline.

## Backend Setup & Run Command
```bash
cd backend
npm install
npm start
```
The backend server runs on `http://localhost:5000`.

## Frontend Setup & Run Command
```bash
cd frontend
npm install
npm run dev
```
The React frontend runs on `http://localhost:5173`.
