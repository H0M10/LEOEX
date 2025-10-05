@echo off
echo ========================================
echo  LEO Data Analytics Platform Launcher
echo ========================================
echo.

echo [1/3] Iniciando Backend (Puerto 9002)...
cd /d "C:\Users\hanni\Desktop\Juego\server_new"
start "LEO Backend" cmd /k "npm run dev"

echo.
echo [2/3] Esperando 3 segundos...
timeout /t 3 /nobreak >nul

echo.
echo [3/3] Iniciando Frontend (Puerto 5174)...
cd /d "C:\Users\hanni\Desktop\Juego\client"
start "LEO Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo  Plataforma iniciada exitosamente!
echo ========================================
echo.
echo Frontend: http://localhost:5174
echo Backend:  http://localhost:9002
echo.
echo APIs Configurables:
echo - NASA API (elimina error 429)
echo - N2YO (tracking tiempo real)  
echo - OpenWeather (datos meteorologicos)
echo.
echo Presiona cualquier tecla para abrir el navegador...
pause >nul

start "" "http://localhost:5174"

echo.
echo ¡Disfruta de los datos satelitales reales!
echo Para cerrar, cierra las ventanas de terminal.
pause