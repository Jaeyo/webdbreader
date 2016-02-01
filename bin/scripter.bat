@echo off
rem JAVA_HOME=

rem ###########################
set PORT=8098
set JETTY_THREAD_POOL_SIZE=20
rem ###########################


if "%JAVA_HOME%" == "" (
  set /p JAVA_HOME= input JAVA_HOME path : 
)

set JAVA_EXE=%JAVA_HOME%\bin\java.exe

set CURRENT_PATH=%~dp0

set BOOTSTRAP_MAIN_CLASS=com.igloosec.scripter.Bootstrap
set SHUTDOWN_MAIN_CLASS=com.igloosec.scripter.Shutdown
set VERSION_MAIN_CLASS=com.igloosec.scripter.Version
set CLASSPATH=%CURRENT_PATH%scripter.jar;%CURRENT_PATH%\lib\*

set MAIN_CLASS=
if "%1" == "start" (
	set MAIN_CLASS=%BOOTSTRAP_MAIN_CLASS%
) else if "%1" == "shutdown" (
	set MAIN_CLASS=%SHUTDOWN_MAIN_CLASS%
) else if "%1" == "version" (
	set MAIN_CLASS=%VERSION_MAIN_CLASS%
) else (
	echo usage: 
	echo ---------------------------------------
	echo start server    : scripter.bat start
	echo shutdown server : scripter.bat shutdown
	echo version         : scripter.bat version
	echo ---------------------------------------
	goto :eof
)

"%JAVA_EXE%" ^
	-Dfile.encoding=utf8 ^
	-Dpath.to.java="%JAVA_HOME%" ^
	-Dport="%PORT%" ^
	-Djetty_thread_pool_size="%JETTY_THREAD_POOL_SIZE%" ^
	-cp "%CLASSPATH%" ^
	"%MAIN_CLASS%"