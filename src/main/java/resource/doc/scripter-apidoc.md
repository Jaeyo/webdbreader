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

## 바인딩 객체