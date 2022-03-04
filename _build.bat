@echo off

mkdir _Build

pkg .

xcopy JustEmuTarkov-* _Build/JustEmuTarkov-*