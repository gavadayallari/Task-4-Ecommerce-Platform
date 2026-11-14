@echo off
echo ========================================================
echo   Fixing Product Images in MongoDB...
echo ========================================================
echo.
cd /d %~dp0backend
node src/utils/fixImages.js
echo.
pause

