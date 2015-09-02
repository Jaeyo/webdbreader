@echo off

rem JAVA_HOME=

if "%JAVA_HOME%" == "" (
  set /p JAVA_HOME= input JAVA_HOME path : 
)

set JAVA_EXE=%JAVA_HOME%\bin\java.exe

set CURRENT_PATH=%~dp0

set CLASSPATH=%CURRENT_PATH%/WebDbReader.jar

set BOOTSTRAP_MAIN_CLASS=com.igloosec.webdbreader.Bootstrap
set SHUTDOWN_MAIN_CLASS=com.igloosec.webdbreader.Shutdown
set VERSION_MAIN_CLASS=com.igloosec.webdbreader.Version

if "%1" == "start" (
  "%JAVA_EXE%" -cp "%CLASSPATH%" -Dfile.encoding=UTF8 -Dpath.to.java="%JAVA_HOME%" %BOOTSTRAP_MAIN_CLASS%
) else if "%1" == "shutdown" (
  "%JAVA_EXE%" -cp "%CLASSPATH%" -Dfile.encoding=UTF8 "%SHUTDOWN_MAIN_CLASS%"
) else if "%1" == "version" (
  "%JAVA_EXE%" -cp "%CLASSPATH%" -Dfile.encoding=UTF8 "%VERSION_MAIN_CLASS%"
) else (
  echo usage : 
  echo \tstart server    : WebDbReader.bat start
  echo \tshutdown server : WebDbReader.bat shutdown
  echo \tversion         : WebDbReader.bat version
)