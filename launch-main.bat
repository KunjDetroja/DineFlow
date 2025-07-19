@echo off

rem Start the backend application
start cmd /k "cd backend && code . && npm run dev"

rem Start the frontend application
start cmd /k "cd frontend && code . && npm run dev"
