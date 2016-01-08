cd %~dp0

@echo *** Start mongo db server ***
start cmd /k c:\mongodb\bin\mongod.exe

timeout 5
@echo *** Start node server ***
start cmd /k node server\init.js

@PAUSE