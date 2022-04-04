@echo off

mkdir _Build

Rem Run this in separate batch cause "pkg ." auto closes command line after finishing
start /WAIT __CMD_RunPKG.bat
Rem Load Generated exe file / Replace its Icon / Compress the exe file
Rem .exe file will be generated in _Build folder
REM node build/pkg-IconCompress.js 
copy justemutarkov-win.exe _Build\

Rem Copy Linux and MacOS versions cause we dont do anything to it
copy justemutarkov-linux _Build\
copy justemutarkov-macos _Build\

Rem Copy Server Data files
xcopy db _Build\db /E /I /Y
xcopy res _Build\res /E /I /Y
xcopy src _Build\src /E /I /Y
xcopy user _Build\user /E /I /Y

Rem Clear cache folder and logs folder
rmdir /q /s _Build\user\cache
mkdir _Build\user\cache
rmdir /q /s _Build\user\logs
mkdir _Build\user\logs

Rem Remove additional unwanted files
del /q build/Server_Compiled_Icon.exe
del /q _Build\user\profiles\*.7z
del /q _Build\user\profiles\*.zip

Rem Clear Repository from compiling leftovers
del /q justemutarkov-linux
del /q justemutarkov-macos
del /q justemutarkov-win.exe
del /q build\Server_Compiled_Icon.exe

echo "Finished | Press any key to close"
pause