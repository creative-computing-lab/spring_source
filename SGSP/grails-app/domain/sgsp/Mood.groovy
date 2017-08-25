package sgsp

import sgsp.sec.User

// 기분
class Mood {

	// 값, 0~100
	long moodValue = 0

	// 글쓰기전이면, T
	boolean isFirst = true

	// 관련 글
	Posts posts
	// 관련 코멘트
	Comment comment

	// 생성, 갱신 일시
	Date dateCreated
	Date lastUpdated

	// 사용자
	static belongsTo = [owner : User]

	static constraints = {
		moodValue range: 0..100
		posts nullable : true
		comment nullable : true
	}

	static mapping = { version false }
}
