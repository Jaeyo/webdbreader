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
* file에 연결하여 file 출력 가능한 File 바인딩 객체를 생성한다.
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

### newCrypto()
* 암복호화 기능을 제공하는 Crypto 바인딩 객체를 생성한다.
* example
```javascriptq
var crypto = newCrypto();
var encrypted = crypto.encrypt('test plain string'); // => encrypted string
var decrypted = crypto.decrypt(encrypted); // => 'test plain string'
```

### newHttp()
* HTTP 연결 관련 기능을 제공하는 Http 바인딩 객체를 생성한다.
* example
```javascript
var http = newHttp();
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

### getType(arg)
* arg의 타입을 Java 객체 기준으로 확인하여 반환한다.
* arguments:
    - arg: 확인할 대상 object
* example
```javascript
print(getType('str') === 'String'); // true
```

### isNumber(arg)
* arg의 타입이 number 타입인지 확인한다.
* arguments: 
    - arg: 확인할 대상 object
* example
```javascript
print(isNumber(123)); // true
print(isNumber('asdf')); // false
```

### isDate(arg)
* arg의 타입이 Date 타입인지 확인한다.
* arguments:
    - arg: 확인할 대상 object
* example
```javascript
print(isDate(new java.util.Date())); //true
print(isDate(new java.sql.Date())); //true
```

### sleep(long ms)
* 지정된 밀리초(ms)만큼 멈춘다.
* Example
```javascript
sleep(1000); //1초 멈춤
```

### replaceWithCurrentDate(str, timestamp)
* 주어진 문자열에서 날짜 지정자에 해당하는 문자들을 현재 시간 기준의 문자열들로 치환한다.
* Example
```javascript
replaceWithCurrentDate('table_$yyyy$mm$dd'); // table_20150101
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
}).query('SELECT * FROM ?', [ 'test_table' ]);
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
}).update('insert into test_table(v1, v2) values(\'?\')', [ 'value1' ]);
```

### batchUpdate(sqls)
* 연결된 데이터베이스로 INSERT/UPDATE/DELETE 및 DDL 쿼리를 batch로 실행한다.
* arguments: 
    - sqls: 실행할 쿼리들
* example
```javascript
newDatabase({
    driver: 'com.mysql.jdbc.Driver',
    connUrl: 'jdbc:mysql://127.0.0.1:3306/spider',
    username: 'admin',
    password: 'admin'
}).batchUpdate([
    'insert into test_table(v1, v2) values(1, 2)',
    'insert into test_table(v1, v2) values(2, 3)',
    'insert into test_table(v1, v2) values(3, 4)'
]);
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
* callback 함수의 argument로 제공되는 row 변수는 QueryResultRow 바인딩 객체로 제공된다.
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

### QueryResultRow
#### join(delimiter)
* 반환된 컬럼들의 데이터들을 하나의 라인으로 병합한다.
* arguments:
    - delimiter: 구분자
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

#### get(args)
* 반환된 컬럼들 중 하나의 컬럼을 반환한다.
* arguments: 
    - args:
        + col: 특정 컬럼을 가리키는 index 혹은 column 명
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

#### eachColumn(callback)
* 반환된 컬럼들을 대상으로 callback을 반복적으로 실행한다.
* arguments: 
    - callback: 실행할 callback 함수
* example
```javascript
var queryResult = srcDb.query('SELECT col1, col2 FROM test_table');
queryResult.eachRow(function(row) {
    var values = [];
    row.eachColumn(function(column) {
        values.push(column);
    });
    destDb.update('INSERT INTO test_table (col1, col2) VALUES ( ? )',
    [ values.join(',') ]);
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

### Crypto
#### encrypt(plaintext)
* 전달된 평문 문자열을 암호화한다.
* arguments:
    - plaintext: 암호화활 평문 문자열
* example
```javascript
var crypto = newCrypto();
var encrypted = crypto.encrypt('test plain string'); // => encrypted string
var decrypted = crypto.decrypt(encrypted); // => 'test plain string'
```

#### encrypt(encryptedtext)
* 전달된 평문 문자열을 암호화한다.
* arguments:
    - encryptedtext: 복호화할 암호화 문자열
* example
```javascript
var crypto = newCrypto();
var encrypted = crypto.encrypt('test plain string'); // => encrypted string
var decrypted = crypto.decrypt(encrypted); // => 'test plain string'
```


### Http
#### String get()
* Http 객체 생성시 파라미터로 전달된 URL에 대해 HTTP GET 요청을 보낸 뒤 돌아온 HTML을 반환한다. 
* Example
```javascript
var html = newHttp('http://testurl.net/test').get();
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