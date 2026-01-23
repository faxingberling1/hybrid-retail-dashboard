@echo off
echo =====================================
echo  Setting up Hybrid POS Monorepo...
echo =====================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set node_version=%%i
echo ✅ Node.js version: %node_version%

REM Check if npm is installed
for /f "tokens=*" %%i in ('npm --version') do set npm_version=%%i
echo ✅ npm version: %npm_version%

echo.
echo 📦 Installing root dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

echo.
echo 📦 Installing website dependencies...
cd apps\website
call npm install
if errorlevel 1 (
    echo ❌ Failed to install website dependencies
    cd ..
    pause
    exit /b 1
)
cd ..\..

echo.
echo ✅ All dependencies installed successfully!

echo.
echo 🔍 Verifying JSON files...
echo Checking package.json...
powershell -Command "try { Get-Content package.json | ConvertFrom-Json | Out-Null; Write-Host '✅ Root package.json is valid JSON' -ForegroundColor Green } catch { Write-Host '❌ Root package.json is invalid JSON' -ForegroundColor Red }"

echo Checking website package.json...
powershell -Command "try { Get-Content apps/website/package.json | ConvertFrom-Json | Out-Null; Write-Host '✅ Website package.json is valid JSON' -ForegroundColor Green } catch { Write-Host '❌ Website package.json is invalid JSON' -ForegroundColor Red }"

echo.
echo =====================================
echo 🎉 Setup complete!
echo =====================================
echo.
echo Next steps:
echo 1. Start development server: npm run dev:website
echo 2. Open browser: http://localhost:3000
echo 3. Build for production: npm run build:website
echo.
pause

echo.
echo 🚀 Starting development server...
call npm run dev:website