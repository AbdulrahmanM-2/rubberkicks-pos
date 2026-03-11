@echo off
REM RubberKicks POS - One-Click Deployment Script for Windows
REM This script automates the deployment process to Vercel

echo ========================================
echo RubberKicks POS - Deployment Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

echo [OK] Node.js version: 
node -v
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Vercel CLI not found. Installing...
    call npm install -g vercel
    echo [OK] Vercel CLI installed
) else (
    echo [OK] Vercel CLI found
)
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [OK] Dependencies installed
echo.

REM Run type check
echo Running type check...
call npm run type-check
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Type check failed
    pause
    exit /b 1
)
echo [OK] Type check passed
echo.

REM Build the application
echo Building application...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)
echo [OK] Build successful
echo.

REM Deploy to Vercel
echo Deploying to Vercel...
echo.
echo Please follow the Vercel CLI prompts:
echo   - Set up and deploy? Y
echo   - Which scope? [Select your account]
echo   - Link to existing project? N (for new deployment)
echo   - What's your project's name? rubberkicks-pos
echo   - In which directory is your code located? ./
echo   - Want to override the settings? N
echo.

call vercel --prod

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Your POS system is now live!
echo Check your Vercel dashboard for the deployment URL.
echo.
echo Next steps:
echo   1. Visit your deployment URL
echo   2. Test all features
echo   3. Configure custom domain (optional)
echo   4. Set up monitoring (optional)
echo.
pause
