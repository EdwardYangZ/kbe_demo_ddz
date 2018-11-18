@echo off
set curpath=%~dp0

cd ..
set KBE_ROOT=%cd%/../
set KBE_RES_PATH=%KBE_ROOT%/kbe/res/;%curpath%/;%curpath%/scripts/;%curpath%/res/
set KBE_BIN_PATH=%KBE_ROOT%/kbe/bin/server/

if defined uid (echo UID = %uid%) else set uid=%random%%%32760+1

cd %curpath%
call "kill_server.bat"

echo KBE_ROOT = %KBE_ROOT%
echo KBE_RES_PATH = %KBE_RES_PATH%
echo KBE_BIN_PATH = %KBE_BIN_PATH%

start %KBE_BIN_PATH%/machine.exe --cid=1001 --gus=1 --hide=1
start %KBE_BIN_PATH%/logger.exe --cid=2001 --gus=2 --hide=1
start %KBE_BIN_PATH%/interfaces.exe --cid=3001 --gus=3 --hide=1
start %KBE_BIN_PATH%/dbmgr.exe --cid=4001 --gus=4 --hide=1
start %KBE_BIN_PATH%/baseappmgr.exe --cid=5001 --gus=5 --hide=1
start %KBE_BIN_PATH%/cellappmgr.exe --cid=6001 --gus=6 --hide=1
start %KBE_BIN_PATH%/baseapp.exe --cid=70011 --gus=7 --hide=1
start %KBE_BIN_PATH%/baseapp.exe --cid=70012 --gus=8 --hide=1
start %KBE_BIN_PATH%/cellapp.exe --cid=80011 --gus=9 --hide=1
start %KBE_BIN_PATH%/cellapp.exe --cid=80012 --gus=10 --hide=1
rem start %KBE_BIN_PATH%/cellapp.exe --cid=8002  --gus=10 --hide=1
start %KBE_BIN_PATH%/loginapp.exe --cid=9001 --gus=11 --hide=1
rem start %KBE_BIN_PATH%/bots.exe      --cid=11000 --gus=12 --hide=1
