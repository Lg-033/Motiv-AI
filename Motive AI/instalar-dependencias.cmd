@echo off
title Motive AI - Instalar Dependencias
color 0F
cls
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao esta instalado.
  echo Instale o Node.js e tente de novo.
  echo.
  pause
  exit /b 1
)

echo Instalando dependencias do projeto...
echo.
npm.cmd install
echo.
echo Instalacao finalizada.
pause
