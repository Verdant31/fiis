@REM winget install OpenJS.NodeJS.LTS --silent

set "diretorio_atual=%cd%"

cd ./fiis-front

@echo off
echo NEXT_PUBLIC_LOCAL_SCRIPT_PATH="%diretorio_atual%\fiis-script\src\index.ts" >> .env

call npm install

cd ..

cd ./fiis-script
call npm install

cd ..

cd ./fiis-front
start chrome "http://localhost:3000"

call npm run dev

pause