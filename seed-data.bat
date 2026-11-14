@echo off
echo ========================================================
echo   Seeding ShopNova Indian Sample Products & Users
echo ========================================================
echo.
cd /d %~dp0backend
node src/utils/seeder.js
echo.
pause

