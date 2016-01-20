cd %~dp0

@echo *** Start mongo db server ***
start cmd /k c:\mongodb\bin\mongod.exe

timeout 5
@echo *** Start node server ***
start cmd /k node server\server.js

timeout 5
start chrome.exe "http://localhost:8080/"

@PAUSE