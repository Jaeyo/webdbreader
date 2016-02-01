scripter에서 제공하는 API는 '전역함수'와 '바인딩 객체' 들로 구성된다. 예를 들어 데이터베이스 접근, 파일 입/출력 등은 Database, File 등의 바인딩 객체를 통해서 가능하며 해당 바인딩 객체들은 각각 알맞은 전역함수를 통해 생성할 수 있다.

## 전역 함수
### newRepeat(args)
* 일정 시간마다 특정 작업이 구동되도록 등록할 수 있는 Repeat 바인딩 객체를 생성한다.
* arguments
    - args: 
        + period: 실행 주기
* example
```javascript
newRepeat({ period: 5 * 60 * 1000 }).run(function() {
    logger.info('this is log');
});
// => 5분에 한번씩 로그를 출력한다.
```

### newDatabase(jdbc)
* database에 연결하여 쿼리를 실행할 수 있는 Database 바인딩 객체를 생성한다.
* arguments: 
    - jdbc:
        + driver: database driver
        + connUrl: database connection url
        + username: database username
        + password: database password
* example
```javascript
newDatabase({
    driver: 'com.mysql.jdbc.Driver',
    connUrl: 'jdbc:mysql://127.0.0.1:3306/spider',
    username: 'admin',
    password: 'admin'
}).query('SELECT * FROM test_table');
```

### newFile(args)
* file에 연결하여 file 출력 실행할 수 있는 File 바인딩 객체를 생성한다.
* arguments:
    - args:
        + filename: 경로를 포함한 파일 이름,
        + charset: 캐릭터 셋(default: UTF-8)
* example
```javascript
newFile({
    filename: '/data/output/$yyyy$mm$dd$hh$mi.log',
    charset: 'UTF-8'
}).appendLine('test');
```

### newLogger()
* 로그 출력을 할 수 있는 Logger 바인딩 객체를 생성한다.
* example
```javascript
var logger = newLogger();
logger.info('test log');
```

### newRepo()
* 간단한 key/value 저장소에 접근할 수 있는 Repo 바인딩 객체를 생성한다.
* example
```javascript
var repo = newRepo();
repo.set('key', 'value');
repo.get('key'); // => 'value'
```

### dateFormat(timestamp, format)
* unix timestamp 포맷의 값을 날짜 포맷에 맞춰 변환한다.
* arguments:
    - timestamp: unix timestamp 형식의 타임스탬프
    - format: 날짜 포맷
* example
```javascript
dateFormat(1453954857204, '$yyyy-$mm-$dd $hh:$mi:$ss');
```

----

## 바인딩 객체
### Repeat
#### run(callback)
* 일정 시간마다 callback 함수를 실행한다.
* arguments:
    - callback: 일정 시간마다 실행할 함수
* example
```javascript
newRepeat({ period: 5 * 60 * 1000 }).run(function() {
    logger.info('this is log');
});
```

### Database
#### query(sql)
* 연결된 데이터베이스로 SELECT 쿼리를 실행한 뒤에 반환된 값에 접근할 수 있는 QueryResult 바인딩 객체를 반환한다.
* arguments:
    - sql: 실행할 쿼리
* example
```javascript
newDatabase({
    driver: 'com.mysql.jdbc.Driver',
    connUrl: 'jdbc:mysql://127.0.0.1:3306/spider',
    username: 'admin',
    password: 'admin'
}).query('SELECT * FROM test_table');
```

#### query(sql, args)
* 연결된 데이터베이스로 SELECT 쿼리를 실행한 뒤에 반환된 값에 접근할 수 있는 QueryResult 바인딩 객체를 반환한다.
* arguments:
    - sql: 실행할 쿼리
    - args: 쿼리 파라미터
* example
```javascript
newDatabase({
    driver: 'com.mysql.jdbc.Driver',
    connUrl: 'jdbc:mysql://127.0.0.1:3306/spider',
    username: 'admin',
    password: 'admin'
}).query('SELECT * FROM ?', 'test_table');
```

#### update(sql)
* 연결된 데이터베이스로 INSERT/UPDATE/DELETE 및 DDL 쿼리를 실행한다.
* arguments:
    - sql: 실행할 쿼리
* example
```javascript
newDatabase({
    driver: 'com.mysql.jdbc.Driver',
    connUrl: 'jdbc:mysql://127.0.0.1:3306/spider',
    username: 'admin',
    password: 'admin'
}).query('insert into test_table(v1, v2) values(\'value1\')');
```

#### update(sql, args)
* 연결된 데이터베이스로 INSERT/UPDATE/DELETE 및 DDL 쿼리를 실행한다.
* arguments:
    - sql: 실행할 쿼리
    - args: 쿼리 파라미터
* example
```javascript
newDatabase({
    driver: 'com.mysql.jdbc.Driver',
    connUrl: 'jdbc:mysql://127.0.0.1:3306/spider',
    username: 'admin',
    password: 'admin'
}).query('insert into test_table(v1, v2) values(\'?\')', 'value1');
```

### QueryResult
#### get(args)
* 쿼리를 실행한 결과에서 특정 행/열의 데이터를 반환한다.
* arguments:
    - args: 
        + row: 행 번호
        + col: 열 번호 / 컬럼 라벨
* example
```javascript
var db = newDatabase({
    driver: 'com.mysql.jdbc.Driver',
    connUrl: 'jdbc:mysql://127.0.0.1:3306/spider',
    username: 'admin',
    password: 'admin'
});
var queryResult = db.query('SELECT col1, col2 FROM test_table');
var col1 = queryResult.get({
    row: 0, col: 0
});
var col2 = queryResult.get({
    row: 0, col: 'col2'
});
```

#### eachRow(callback)
* 쿼리를 실행한 결과의 각 행에 대해서 callback 함수를 실행한다.
* arguments:
    - callback: 실행할 함수
* example
```javascript
var db = newDatabase({
    driver: 'com.mysql.jdbc.Driver',
    connUrl: 'jdbc:mysql://127.0.0.1:3306/spider',
    username: 'admin',
    password: 'admin'
});
var queryResult = db.query('SELECT col1, col2 FROM test_table');
queryResult.eachRow(function(row) {
    var line = row.join(',');
    logger.info(line);
    var col1 = row.get({ col: 0 });
    var col2 = row.get({ col: 'col2' });
});
```

### File
#### append(line)
* 연결된 파일에 line을 출력한다. 
* arguments:
    - line: 파일에 출력할 line
* example
```javascript
newFile({
    filename: '/data/output/$yyyy$mm$dd$hh$mi.log',
    charset: 'UTF-8'
}).appendLine('line');
```

#### appendLine(line)
* 연결된 파일에 line과 라인피드 문자를 출력한다. 
* arguments:
    - line: 파일에 출력할 line
* example
```javascript
newFile({
    filename: '/data/output/$yyyy$mm$dd$hh$mi.log',
    charset: 'UTF-8'
}).appendLine('line');
```

### Logger
#### info(msg)
* INFO 로그를 남긴다.
* example
```javascript
logger.info('this is info log');
```

#### debug(msg)
* DEBUG 로그를 남긴다.
* example
```javascript
logger.debug('this is debug log');
```

#### warn(msg)
* WARN 로그를 남긴다.
* example
```javascript
logger.warn('this is warn log');
```

#### error(msg)
* ERROR 로그를 남긴다.
* example
```javascript
logger.error('this is error log');
```

### Repo
#### set(key, value)
* key/value 저장소에 데이터를 저장한다.
* example
```javascript
var repo = newRepo();
repo.set('key', 'value');
```

#### get(key)
* key/value 저장소에 저장되어 있는 데이터를 반환한다.
* example
```javascript
var repo = newRepo();
repo.set('key');
```

#### get(key, opts)
* key/value 저장소에 저장되어 있는 데이터를 반환한다.
* arguments:
    - opts:
        + isNull: key/value 저장소에 해당 key에 대한 데이터가 없을 경우 반환할 defualt 데이터
* example
```javascript
var repo = newRepo();
repo.set('key', { isNull: 'defaultValue' });
```