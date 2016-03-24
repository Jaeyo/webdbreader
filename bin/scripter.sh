#!/bin/sh
#JAVA_HOME=

###########################
PORT=8098
JETTY_THREAD_POOL_SIZE=20
SCRIPT_AUTO_START=true
###########################

if [ "$JAVA_HOME" = "" ]
then
	echo "input JAVA_HOME path : "
	read JAVA_HOME
fi

JAVA_EXE=$JAVA_HOME/bin/java

CURRENT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

BOOTSTRAP_MAIN_CLASS=com.igloosec.scripter.Bootstrap
SHUTDOWN_MAIN_CLASS=com.igloosec.scripter.Shutdown
SHELL_MAIN_CLASS=com.igloosec.scripter.InteractiveShell
VERSION_MAIN_CLASS=com.igloosec.scripter.Version
CLASSPATH=$CURRENT_PATH/scripter.jar:$CURRENT_PATH/lib/*

MAIN_CLASS=
if [ "$1" = "start" ] 
then
	MAIN_CLASS=$BOOTSTRAP_MAIN_CLASS
elif [ "$1" = "shutdown" ] 
then
	MAIN_CLASS=$SHUTDOWN_MAIN_CLASS
elif [ "$1" = "shutdown" ] 
then
	MAIN_CLASS=$SHELL_MAIN_CLASS
elif [ "$1" = "version" ] 
then
	MAIN_CLASS=$VERSION_MAIN_CLASS
else
	echo "usage: "
	echo "-------------------------------------------"
	echo "start server    : sh scripter.sh start"
	echo "shutdown server : sh scripter.sh shutdown"
	echo "shell           : sh scripter.sh shell"
	echo "version         : sh scripter.sh version"
	echo "-------------------------------------------"
	exit 0
fi

"$JAVA_EXE" \
	-Dfile.encoding=utf8 \
 	-Dpath.to.java="$JAVA_HOME" \
 	-Dport="$PORT" \
 	-Djetty.thread.pool.size="$JETTY_THREAD_POOL_SIZE" \
 	-Dscript.auto.start="$SCRIPT_AUTO_START" \
	-cp "$CLASSPATH" \
 	"$MAIN_CLASS"