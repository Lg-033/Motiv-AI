@echo off
title Motive AI Server
color 0F
cls
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js nao esta instalado neste computador.
  echo.
  echo 1. Instale o Node.js em https://nodejs.org/
  echo 2. Feche esta janela
  echo 3. Abra o arquivo iniciar-app.cmd de novo
  echo.
  pause
  exit /b 1
)

echo Iniciando o Motive AI...
echo.
echo Depois abra no navegador:
echo http://localhost:3000
echo.
echo Iniciando servidor com Node...
echo.
node server.js
echo.
echo O servidor foi encerrado ou ocorreu um erro.
pause
