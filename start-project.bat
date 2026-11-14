@echo off
echo ========================================================
echo   Starting ShopNova - Indian E-Commerce Marketplace
echo ========================================================
echo.
echo Starting Backend Server on http://localhost:5001...
start "ShopNova Backend (Port 5001)" cmd /k "cd /d %~dp0backend && npm run dev"

echo Starting Frontend Dev Server on http://localhost:5174...
start "ShopNova Frontend (Port 5174)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================================
echo   Services are running!
echo   Frontend: http://localhost:5174
echo   Backend:  http://localhost:5001
echo ========================================================
echo.
pause

