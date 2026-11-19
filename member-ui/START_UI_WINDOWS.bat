@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Please install Node.js 18 or newer.
  pause
  exit /b 1
)
if not exist "node_modules" (
  echo Installing frontend dependencies...
  call npm install
  if errorlevel 1 (pause & exit /b 1)
)
echo Starting MemberSC member portal...
call npm run dev
pause
