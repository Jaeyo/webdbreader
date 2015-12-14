#!/bin/sh
#JAVA_HOME=

###########################
PORT=8098
JETTY_THREAD_POOL_SIZE=20
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
VERSION_MAIN_CLASS=com.igloosec.scripter.Version
CLASSPATH=$CURRENT_PATH/scripter.jar:$CURRENT_PATH/lib/*

MAIN_CLASS=
if [ "$1" = "start" ] then
	MAIN_CLASS=BOOTSTRAP_MAIN_CLASS
elif [ "$1" = "shutdown" ] then
	MAIN_CLASS=SHUTDOWN_MAIN_CLASS
elif [ "$1" = "version" ] then
	MAIN_CLASS=VERSION_MAIN_CLASS
else
	echo "usage: "
	echo "\tstart server             : sh scripter.sh start"
	echo "\tshutdown server   : sh scripter.sh shutdown"
	echo "\tversion                      : sh scripter.sh version"
	exit 0
fi

"$JAVA_EXE" \
	-Dfile.encoding=utf8 \
 	-Dpath.to.java="$JAVA_HOME" \
 	-Dport="$PORT" \
 	-Djetty_thread_pool_size="$JETTY_THREAD_POOL_SIZE" \
	-cp "$CLASSPATH" \
 	"$MAIN_CLASS"