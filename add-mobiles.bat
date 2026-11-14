@echo off
echo ========================================================
echo   Adding 10 Mobile Products to ShopNova MongoDB...
echo ========================================================
echo.
cd /d %~dp0backend
node src/utils/addMobiles.js
echo.
pause

