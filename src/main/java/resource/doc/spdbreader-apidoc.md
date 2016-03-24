SpDbReader는 scripter의 이전 버전으로 scripter에서는 SpDbReader에서 사용하던 스크립트 또한 구동이 가능하다.

## 바인딩 객체
사용자 스크립트 상에서 사용할 수 있도록 SpDbReader 에서 제공하는 객체들이다. config 기능을 사용하지 않고 직접 사용자 스크립트를 생성/수정하는 경우 아래의 바인딩 객체 및 예제 코드를 참고하여 작성하도록 한다.

### DateUtil
#### String format(long date, String format)
* long 형으로 주어진 시간(date)을 포맷(format)에 맞춰서 출력한다. long 형의 시간 값은 DateUtil.parse(), DateUtil.currentTimeMillis()를 통해 구할 수 있다.
* Returns 포맷팅된 날짜
* Example
```javascript
var formattedDate = dateUtil.format(1414460642364, "yyyyMMddHHmmss"); // => 20141028104502 
var formattedDate = dateUtil.format(1414460642364, "yyyyMMdd"); // => 20141028
var formattedDate = dateUtil.format(1414460642364, "yyyy-MM-dd"); // => 2014-10-28
```

#### long parse(String date, String format)
* 포맷(format)에 맞춰 포맷팅된 시간값(date)를 long 형태의 시간 값으로 변환한다.
* Returns long 타입의 시간 값
* Example
```javascript
var dateValue = dateUtil.parse("20141028104502", "yyyyMMddHHmmss"); // => 1414460642364
var dateValue = dateUtil.parse("20141028", "yyyyMMdd"); // => 1414422000000
var dateValue = dateUtil.parse("2014 10-28", "yyyy MM-dd"); // => 1414422000000
```

#### long currentTimeMillis()
* 현재 시간을 long 형태의 시간 값으로 변환한다.
* Returns long 타입의 시간값
* Example
```javascript
var currentTime = dateUtil.currentTimeMillis(); // => 1414460642364
```

----

### DbHandler
#### void executeQuery(String dbName, String query)
* 지정된 데이터베이스(dbName)에 대해서 insert, update, delete 쿼리(query)를 실행한다. 데이터베이스는 registerdb 메뉴를 통해 미리 등록되어 있어야 한다.
* Example
```javascript
dbHandler.executeQuery("sampleDb1", "insert into test_table(value1, value2) values('test1', 'test2')");
```

#### void executeBatch(String dbName, String[] queries)
* 지정된 데이터베이스(dbName)에 대해서 insert, update, delete 쿼리(query)를 batch로 실행한다. 데이터베이스는 registerdb 메뉴를 통해 미리 등록되어 있어야 한다.
* Example
```javascript
var queries = [];
queries.push("insert into test_table (value1) values('test1')");
queries.push("insert into test_table (value1) values('test2')");
queries.push("insert into test_table (value1) values('test3')");
dbHandler.executeBatch("sampleDb1", queries);
```

#### String selectQuery(String dbName, String query)
* 지정된 데이터베이스(dbName)에 대해서 select 쿼리(query)를 실행한 결과를 String 형식으로 반환한다. 반환되는 데이터들의 row간 구분자는 '\n', column간 구분자는 공백(' ')으로 구성된다. 데이터베이스는 registerdb 메뉴를 통해 미리 등록되어 있어야 한다.
* Returns select 쿼리의 결과
* Example
```javascript
var result = dbHandler.selectQuery("sampleDb1", "select value1, value2 from test_table"); // => "test|test2\ntest3|test4"
```

#### Iterator selectQueryIterator(String dbName, String query)
* 지정된 데이터베이스(dbName)에 대해서 select 쿼리(query)를 실행한 결과를 DbRowIterator 형식으로 반환한다. DbRowIterator 클래스를 통해 건수가 많은 데이터를 한번에 불러와 메모리에 과다 적재되는 문제를 방지하고 한 행씩 받아 처리할 수 있다.
* DbRowIterator는 next()와 close() 두 개의 메소드를 가지는데, next()는 다음행 데이터를 문자열 배열 형태로 반환하며 마지막 행에 다다랐을 경우 null을 반환하고 close() 메소드는 데이터베이스와의 연결을 끊는다.
* Returns DbRowIterator
* Example
```javascript
var rowIterator = dbHandler.selectQueryIterator("sampleDb1", "select value1, value2 from test_table");
var row = null;
while((row = rowIterator.next()) != null){
  logger.info("column count is " + row.length); // rowIterator.next()를 통해 문자열 배열 형태로 받았기 때문에 length 속성을 통해 컬럼 갯수를 확인할 수 있다.
  for(var i=0; i<row.length; i++){
    logger.info("column " + i + " : " + row[i]); //각 컬럼별로 값을 로그로 출력한다.
  } //for i
} //while
rowIterator.close(); //사용이 끝난 DbRowIterator는 항상 close 메소드를 호출하여 데이터베이스와의 연결을 종료시킨다.
```

#### String selectQuery(String dbName, String query, String delimiter)
* 지정된 데이터베이스(dbName)에 대해서 select 쿼리(query)를 실행한 결과를 String 형식을 변환하여 반환한다. 반환되는 데이터의 row간 구분자는 '\n', column간 구분자는 파라미터에서 지정된 delimiter로 구성된다. 데이터베이스는 registerdb메뉴를 통해 미리 등록되어 있어야 한다.
* Returns select 쿼리의 결과
* Example
```javascript
String result = dbHandler.selectQuery("sampleDb1", "select value1, value2 from test_table", ","); // => "test1,test2\ntest3,test4"
```

#### void selectAndAppend(String dbName, String query, String delimiter, String filename, String charsetName)
* 지정된 데이터베이스(dbName)에 대해서 select 쿼리(query)를 실행한 결과를 곧바로 파일로 출력한다. 출력되는 데이터들의 row간 구분자는 '\n', column 간 구분자는 파라미터에서 지정된 delimiter로 구성된다. 데이터베이스는 registerdb메뉴를 통해 미리 등록되어 있어야 한다.
* Example
```javascript
dbHandler.selectAndAppend("sampleDb1", "select value1, value2 from test_table", ",", "/data/output.txt", "UTF-8");
```

----

### FileExporter
#### void write(String filename, String content)
* 파라미터 content에 담긴 내용을 파일로 출력한다. filename은 절대경로를 포함한 파일명으로 작성되어야 하며 해당 파일이 없을 경우 자동으로 생성한다. 기존에 파일 내 기록된 내용이 있을 경우 덮어써진다.
* Example
```javascript
fileExporter.write("/data/output.txt", "this is output.txt"); // => /data/output.txt 파일이 생성되며 "this is output.txt" 파일이 기록된다.
```

#### void write(String filename, String content, String charsetName)
* 파라미터 content에 담긴 내용을 지정된 캐릭터셋(charsetName)으로 파일에 출력한다. filename은 절대경로를 포함한 파일명으로 작성되어야 하며 해당 파일이 없을 경우 자동으로 생성한다. 기존에 파일 내 기록된 내용이 있을 경우 덮어써진다.
* Example
```javascript
fileExporter.write("/data/output.txt", "this is output.txt", "euc-kr");
fileExporter.write("/data/output.txt", "this is output.txt", "utf8");
fileExporter.write("/data/output.txt", "this is output.txt", "cp949");
```

#### void append(String filename, String content)
* 파라미터 content에 담긴 내용을 파일에 출력한다. filename은 절대경로를 포함한 파일명으로 작성되어야 하며 해당 파일이 없을 경우 자동으로 생성한다. 기존에 파일 내 기록된 내용이 있을 경우 뒤에 이어서 기록된다.
* Exmaple
```javascript
fileExporter.write("/data/output.txt", "this is test.txt");
```

#### void append(String filename, String content, String charsetName)
* 파라미터 content에 담긴 내용을 지정된 캐릭터셋(charsetName)으로 파일에 출력한다. filename은 절대경로를 포함한 파일명으로 작성되어야 하며 해당 파일이 없을 경우 자동으로 생성한다. 기존에 파일 내 기록된 내용이 있을 경우 뒤에 이어서 기록된다.
* Example
```javascript
fileExporter.write(“/data/output.txt”, “this is output.txt”, “euc-kr”);
fileExporter.write(“/data/output.txt”, “this is output.txt”, “utf8”);
fileExporter.write(“/data/output.txt”, “this is output.txt”, “cp949);
```

#### void createFile(String filename)
* filename에 해당하는 파일을 생성한다. filename은 절대경로를 포함한 파일명으로 작성되어야 한다.
* Example
```javascript
fileExporter.createFile("/data/output.txt"); // => /tmp/output.txt 파일이 생성된다.
```

----

### Scheduler
#### void schedule(long period, Runnable task)
* task에 담긴 로직을 period 주기에 따라 반복하여 실행한다. period는 밀리초를 기준으로 지정되어야 한다.
* Example
```javascript
scheduler.schedule(5*1000, new java.lang.Runable(){
    run:function(){
        logger.info(“test log”);
    }
});
//=> 5초마다 주기적으로 로그를 남긴다.
```

#### void schedule(long delay, long period, Runnable task)
* task에 담긴 로직을 delay 만큼의 시간 이후에 period 주기에 따라 반복하여 실행한다. Delay와 period는 밀리초를 기준으로 지정되어야 한다.
* Example
```javascript
  scheduler.schedule(3*1000, 5*1000, new java.lang.Runable(){
    run:function(){
      logger.info(“test log”);
    }
  });
// => 3초후부터 5초마다 주기적으로 로그를 남긴다.
```

#### void scheduleAtFixedTime(String[] hhMMs, Runnable task)
* task에 담긴 로직을 24시간 주기로 정해진 시간(hhMMs)에 실행한다.
* hhMMs 는 시간+분으로 구성된 4자리 문자열의 배열이다.
* Example
```javascript
var hhmms = [];
hhmms.push('0100');
hhmms.push('1200');
hhmms.push('1800');
scheduler.scheduleAtFixedTime(hhmms, new java.lang.Runnable(){
  run:function(){
    logger.info(“test log”);
  }
});
// => 매일 1시, 12시, 18시에 한번씩 로그를 남긴다.
```

----

### SimpleRepo
#### void store(String key, String value)
* 간단한 key-value 형태의 데이터를 저장한다. 저장된 내용은 conf/simple_repo.properties 파일 내에 xml 형태로 저장되어 재기동 이후에도 유지된다. 같은 key를 가진 서로 다른 데이터 value가 저장될 경우 나중에 요청된 value가 저장된다.
* Example
```javascript
simpleRepo.store(“lastExecutedTime”, “2014 1028 1139”);
```

#### String load(String key)
* 해당 key에 대한 value 데이터를 불러온다. 해당 key에 대한 데이터가 없을 경우 null을 반환한다.
* Example
```javascript
simpleRepo.load(“lastExecutedTime”);  // => “2014 1028 1139”
```

#### String load(String key, String defaultValue)
* 해당 key에 대한 value 데이터를 불러온다. 해당 key에 대한 데이터가 없을 경우 defaultValue를 반환한다.
* Example
```javascript
simpleRepo.load(“firstExecutedTime”, “2014 1028 1000”); //”firstExecutedTime” key에 대한 데이터가 없을 경우
// => “2014 1028 1000”
```

#### void clear()
* key-value 저장소에 저장된 데이터들을 초기화한다.
* Example
```javascript
simpleRepo.clear();
```

----

### RuntimeUtil
#### void openShutdownPort()
* 프로세스 종료를 위한 포트를 개방한다. 기본 포트는 8021이다.
* Example
```javascript
runtimeUtil.openShutdownPort();
```

#### void openShutdownPort(int port)
* 프로세스 종료를 위한 포트(port)를 지정하여 개방한다.
* Example
```javascript
runtimeUtil.openShutdownPort();
```

#### void sleep(long timeMillis)
* 지정된 밀리초(timeMillis)만큼 멈춘다.
* Example
```javascript
runtimeUtil.sleep(1000); //1초 멈춤
```

#### void shutdown()
* 프로세스를 종료한다.
* Example
```javascript
runtimeUtil.shutdown();
```

----

### Logger
#### void info(String message)
* INFO 로그를 남긴다.
* Example
```javascript
logger.info(“this is info log”);
```

#### void debug(String message)
* DEBUG 로그를 남긴다.
* Example
```javascript
logger.debug(“this is debug log”);
```

#### void warn(String message)
* WARN 로그를 남긴다.
* Example
```javascript
logger.warn(“this is warn log”);
```

#### void error(String message)
* ERROR 로그를 남긴다.
* Example
```javascript
logger.error(“this is error log”);
```

#### void trace(String message)
* TRACE 로그를 남긴다.
* Example
```javascript
logger.trace(“this is trace log”);
```

----

### FileReader
#### void monitorFileNewLine(String filename, Function onLine, boolean deleteExpiredFile)
* 해당 파일(filename)을 감시하면서 새로운 line이 추가될 때마다 onLine Function을 실행한다. filename에는 $yyyy$mm$dd$hh$mi$ss 와 같이 date format 지정이 가능하며 이에 따른 파일 switching 시에 deleteExpiredFile 변수를 통해 지나간 파일을 지울지 여부를 선택할 수 있다.
* 캐릭터셋은 UTF-8 로 설정된다.
* Example
```javascript
var onLine = new com.igloosec.SpDbReader.common.Function(){
  execute:function(args){
    var line=args[0];
    var filename=args[1];
    logger.info('file: ' + filename + ', line: ' + line);
  } //execute
} //onLine
 
fileReader.monitorFileNewLine("/data/test_$yyyy$mm$dd$hh$mi.log", onLine, true);
```

#### void monitorFileNewLine(String filename, Function onLine, boolean deleteExpiredFile, String charset)
* 해당 파일(filename)을 감시하면서 새로운 line이 추가될 때마다 onLine Function을 실행한다. filename에는 $yyyy$mm$dd$hh$mi$ss 와 같이 date format 지정이 가능하며 이에 따른 파일 switching 시에 deleteExpiredFile 변수를 통해 지나간 파일을 지울지 여부를 선택할 수 있다.
* charset 항목에는 케릭터 셋을 지정한다. 지정 가능한 캐릭터셋은 Java Standard Charset(http://docs.oracle.com/javase/7/docs/api/java/nio/charset/Charset.html) 이외에 SpDbReader 가 사용하는 jvm 에서 지원하는 캐릭터 셋에 한한다.
* Example
```javascript
var onLine = new com.igloosec.SpDbReader.common.Function(){
  execute:function(args){
    var line=args[0];
    var filename=args[1];
    logger.info('file: ' + filename + ', line: ' + line);
  } //execute
} //onLine
 
fileReader.monitorFileNewLine("/data/test_$yyyy$mm$dd$hh$mi.log", onLine, true, "euc-kr");
```

#### void monitorFileNewLine(String filename, Function onLine, boolean deleteExpiredFile, String charset, int timeAdjustSec)
* 해당 파일(filename)을 감시하면서 새로운 line이 추가될 때마다 onLine Function을 실행한다. filename에는 $yyyy$mm$dd$hh$mi$ss 와 같이 date format 지정이 가능하며 이에 따른 파일 switching 시에 deleteExpiredFile 변수를 통해 지나간 파일을 지울지 여부를 선택할 수 있다.
* 파일 지정시 timeAdjustSec 파라미터를 통해 읽고자 하는 파일의 시간대를 조정할 수 있다.
* charset 항목에는 케릭터 셋을 지정한다. 지정 가능한 캐릭터셋은 Java Standard Charset(http://docs.oracle.com/javase/7/docs/api/java/nio/charset/Charset.html) 이외에 SpDbReader 가 사용하는 jvm 에서 지원하는 캐릭터 셋에 한한다.
* added version : 0.93b
* Example
```javascript
var onLine = new com.igloosec.SpDbReader.common.Function(){
  execute:function(args){
    var line=args[0];
    var filename=args[1];
    logger.info('file: ' + filename + ', line: ' + line);
  } //execute
} //onLine
 
fileReader.monitorFileNewLine("/data/test_$yyyy$mm$dd$hh$mi.log", onLine, true, "euc-kr", -60);
```

#### String readAll(String filename)
* 해당 파일(filename)의 내용을 모두 읽어 반환한다.
* Example
```javascript
var result = fileReader.readAll("/data/test.txt");
```

#### String readAll(String filename, boolean delete)
* 해당 파일(filename)의 내용을 모두 읽어 반환한다. 파라미터 delete가 true인 경우 읽은 파일을 삭제한다.
* Example
```javascript
var result = fileReader.readAll("/data/test.txt", true); //파일 읽은 후에 삭제
```

#### String readAll(String filename, boolean delete, long maxBytes)
* 해당 파일(filename)의 내용을 최대 maxBytes 만큼만 읽어 반환한다. 파라미터 delete가 true인 경우 읽은 파일을 삭제한다.
* Example
```javascript
var result = fileReader.readAll("/data/test.txt", false, 1*1024*1024); //최대 1MB 만큼만 읽는다.
```

----

### OutputFileDeleteTask
#### void startMonitoring(long period, long expiredTime)
* 출력 파일의 삭제를 위한 모니터링을 시작한다. period 주기마다 파일에 마지막으로 write된 시간을 감시하며 현재시간으로부터 expiredTime 만큼 경과했을 경우 해당 파일을 삭제한다. period와 expiredTime은 모두 밀리초 기준으로 작성되어야 한다.
* Example
```javascript
outputFileDeleteTask.startMonitoring(10*1000, 3*60*60*1000);
```

----

### StringUtil
#### String stringAt(String line, String delimiter, int index)
* 파라미터로 전달된 문자열(line)에서 구분자(delimiter) 기준으로 특정 부분에 있는 부분 문자열을 추출하여 반환한다.
* Example
```javascript
var result = stringUtil.stringAt("aaa,bbb,ccc,ddd", ",", 2); // ccc 반환
```

----

### HttpUtil
#### String requestGet(String url)
* 파라미터로 전달된 url에 대해 HTTP 요청을 보낸 뒤에 돌아온 HTML을 반환한다.
* added Version: 1.0.6
* Example
```javascript
var html = httpUtil.requestGet('http://testurl.net/test');
```

----

### ThreadPoolUtil
#### ThreadPool newFixedThreadPool(int threadCount)
* 고정된 수의 thread들을 가지는 thread pool을 생성하여 반환한다.
* added Version: 1.2.0
* Example
```javascript
var threadPool = threadPoolUtil.newFixedThreadPool(10);
threadPool.submit(function() {
  logger.info('this is another thread in thread pool');
});
```