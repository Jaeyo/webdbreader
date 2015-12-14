package com.igloosec.scripter;

import java.util.ArrayList;
import java.util.List;

public class Version {
	private static String currentVersion;
	private static List<History> histories=new ArrayList<History>();
	
	public static void main(String[] args) {
		System.out.println(String.format("WebDbReader (%s)", currentVersion));
	} //main
	
	static{
		currentVersion="2.0.0";
		
		String version=null;
		String historyNote = null;
		
		version="2.0.0";
		historyNote="1. scripter ( SpDbReader for web ) (2015. 08. 24)\n";
		histories.add(new History(version, historyNote));
		
		version="1.0.5";
		historyNote="1. Scheduler.scheduleAtFixedTime 메소드 추가 (2015. 07. 09)\n";
		histories.add(new History(version, historyNote));
		
		version="1.0.4";
		historyNote="1. DbHandler.selectQueryIterator() 메소드 추가 (2015. 07. 03)\n";
		histories.add(new History(version, historyNote));
		
		version="1.0.3";
		historyNote="1. Bootstrap 클래스 통해 기동하도록 수정 (2015. 05. 28)\n"+
					"2. conf/log4j.xml을 통해 로그 정책 설정할 수 있도록 수정 (2015. 05. 29)\n"+
					"3. 스크립트 실행시에 lib 폴더 클래스패스에서 빠진 현상 수정 (2015. 06. 15)\n"+
					"3. 스크립트 상에 try-catch 구문 삽입 (2015. 06. 16)\n";
		histories.add(new History(version, historyNote));
		
		version="1.0.2b";
		historyNote="1. fileReader.readAll() 호출시 null 반환하던 현상 수정 (2015. 05. 28)\n";
		histories.add(new History(version, historyNote));
		
		version="1.0.2";
		historyNote="1. heath check를 위한 ping-pong 기능 추가 (2015. 05. 27)\n";
		histories.add(new History(version, historyNote));
		
		version="1.0.1";
		historyNote="1. table 명에 날짜가 들어간 케이스 대응 (2015. 05. 06)\n";
		histories.add(new History(version, historyNote));
		
		version="1.0";
		historyNote="1. dbHandler.executeBatch 추가 (2015. 04. 16)\n";
		histories.add(new History(version, historyNote));
		
		version="0.95";
		historyNote="1. dblist에서 modify 버튼 -> save 버튼으로 변경(2015. 04. 14)" +
					"2. 저장된 xml 불러올 수 있도록 수정 (2015. 04. 16)\n" +
					"3. xml, js 저장시 파일이름 지정 가능하도록 수정 (2015 04. 16)\n" +
					"4. dbHandler.executeBatch 추가 (2015. 04. 16)\n";
		histories.add(new History(version, historyNote));
		
		version="0.94";
		historyNote="1. jar, sh 위치 상위로 이동 (2015. 01. 26)\n"+
					"2. 'registerdb' -> 'register database', 'dblist' -> 'database list' 변경(2015. 01. 26)\n"+
					"3. close 버튼 위에 빈줄 삽입 (2015. 01. 26)\n"+
					"4. theme 적용 (2015. 03. 25)\n";
		histories.add(new History(version, historyNote));
		
		version="0.93";
		historyNote="1. StringUtil 추가 (2015. 02. 03)\n";
		histories.add(new History(version, historyNote));
		
		version="0.92";
		historyNote="1. periodInMin -> periodInSec 변경(2015. 1. 15)\n"+
					"2. xml 생성시 xml 폴더 내에 생성 (2015. 1. 15)\n"+
					"3. js 생성시 파일 이름내 xml 제거 (2015. 1. 15)\n"+
					"4. expired file delete 기본값은 비활성화, 비활성화시에 값 0으로 수정(2015. 1. 15)\n"+
					"5. 'new script' -> 'create script', 'charset' -> 'db charset' 변경(2015. 1. 15)\n"+
					"6. usage 출력시에 version도 같이 명시 (2015. 1. 15)\n"+
					"7. binding 객체 FileReader 추가 (2015. 1. 19)\n"+
					"8. sequence binding 시에 biggerCondition 미정의 현상 수정(2015. 1. 29)"+
					"9. mysql connection URL template 수정";
		histories.add(new History(version, historyNote));
		
		version="0.91";
		historyNote="1. FileReader 추가 (2015. 1. 15)\n";
		histories.add(new History(version, historyNote));
	} //static
	
	public static String getCurrentVersion(){
		return currentVersion;
	} //getCurrentVersion
	
	private static class History {
		private String version;
		private String historyNote;

		public History(String version, String historyNote) {
			this.version = version;
			this.historyNote = historyNote;
		} // INIT

		public String getVersion() {
			return version;
		}

		public void setVersion(String version) {
			this.version = version;
		}

		public String getHistoryNote() {
			return historyNote;
		}

		public void setHistoryNote(String historyNote) {
			this.historyNote = historyNote;
		}
	} // class
} // class
