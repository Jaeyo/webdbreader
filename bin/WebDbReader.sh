#!/bin/sh
#JAVA_HOME=

if [ "$JAVA_HOME" = "" ]
then
  echo "input JAVA_HOME path : "
  read JAVA_HOME
fi

JAVA_EXE=$JAVA_HOME/bin/java

CURRENT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

CLASSPATH=$CURRENT_PATH/WebDbReader.jar

BOOTSTRAP_MAIN_CLASS=com.igloosec.webdbreader.Bootstrap
SHUTDOWN_MAIN_CLASS=com.igloosec.webdbreader.Shutdown
VERSION_MAIN_CLASS=com.igloosec.webdbreader.Version

if [ "$1" = "start" ]
then
  "$JAVA_EXE" -cp "$CLASSPATH" -Dfile.encoding=UTF8 -Dpath.to.java="$JAVA_HOME" $"$BOOTSTRAP_MAIN_CLASS"
elif [ "$1" = "shutdown" ]
then
  "$JAVA_EXE" -cp "$CLASSPATH" -Dfile.encoding=UTF8 "$SHUTDOWN_MAIN_CLASS"
elif [ "$1" = "shutdown" ]
then
  "$JAVA_EXE" -cp "$CLASSPATH" -Dfile.encoding=UTF8 "$VERSION_MAIN_CLASS"
else
  echo "usage : "
  echo "\tstart server    : sh WebDbReader.sh start"
  echo "\tshutdown server : sh WebDbReader.sh shutdown"
  echo "\tversion         : sh WebDbReader.sh version"
fi
