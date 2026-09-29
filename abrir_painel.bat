@echo off
chcp 65001 > nul
echo ========================================================
echo   Painel do Diagnóstico das Escolas do Poder Judiciário
echo   Escola Nacional do Judiciário (ENAJU) · CNJ
echo ========================================================
echo.
echo Abrindo o painel interativo no navegador padrão...
start "" "%~dp0index.html"
echo.
echo Painel aberto com sucesso!
exit /b
