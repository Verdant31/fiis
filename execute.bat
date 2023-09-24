@REM winget install OpenJS.NodeJS.LTS --silent

cd ./fiis-front

call npm install

cd ..

cd ./fiis-script
call npm install

cd ..

cd ./fiis-front
start chrome "http://localhost:3000"

call npm run dev

pause