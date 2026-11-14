@echo off
echo ========================================================
echo   Populating 10 Products for Each Category...
echo   Home & Furniture, Appliances, Beauty, Grocery, Accessories
echo ========================================================
echo.
cd /d %~dp0backend
node src/utils/populateAllCategories.js
echo.
pause

