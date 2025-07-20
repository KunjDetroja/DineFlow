@echo off

rem Start the backend application
start cmd /k "cd backend && npm start"

rem Start the frontend application
start cmd /k "cd frontend && npm run dev"

rem Start the marketing Frontend application
start cmd /k "kiro . && cd marketing-frontend && npm run dev"
