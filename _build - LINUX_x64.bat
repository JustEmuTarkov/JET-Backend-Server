@echo off

node build/build_linux.js
echo BUild completed Press key to continue with creatign build for release
pause
rmdir /q /s _Build
mkdir _Build
copy build\Server _Build\
xcopy db _Build\db /E /I
xcopy res _Build\res /E /I
xcopy src _Build\src /E /I
xcopy user _Build\user /E /I

rmdir /q /s _Build\user\cache
mkdir _Build\user\cache
rmdir /q /s _Build\user\logs
mkdir _Build\user\logs

del /q _Build\user\mods\*.*
del /q _Build\user\profiles\*.7z
del /q _Build\user\profiles\*.zip

rmdir /q /s build\minified
pause