@echo off
echo 🚀 Iniciando LEO Decisions...

echo 📦 Instalando dependencias del backend...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error instalando backend
    pause
    exit /b 1
)

echo 📦 Instalando dependencias del frontend...
cd ../client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error instalando frontend
    pause
    exit /b 1
)

echo 🎮 Iniciando servidor backend...
start cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak > nul

echo 🎨 Iniciando servidor frontend...
start cmd /k "cd client && npm run dev"

echo ✅ ¡LEO Decisions está listo!
echo 🌐 Abre tu navegador en: http://localhost:5173
echo 📖 Lee el README.md para más información

pause