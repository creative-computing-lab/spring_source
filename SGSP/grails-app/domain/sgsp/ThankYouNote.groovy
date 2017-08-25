package sgsp

import sgsp.data.FeedType
import sgsp.sec.User

// 탱큐노트
class ThankYouNote {
	// 내용
	String shortContent
	String body

	// 관련 코멘트
	Comment comment
	// 관련글
	Posts posts
	
	// 삭제여부
	boolean isRemoved = false
	boolean isRead = false

	// 생성, 갱신 일시
	Date dateCreated
	Date lastUpdated
	
	// 받는 사람
	User to

	// 보내는사람 (작성자)
	static belongsTo = [owner : User]

	static constraints = { shortContent nullable : true }
	
	static mapping = {
		shortContent length: 200
		body type : 'text'
		version false
	}

	def beforeInsert() {
		if(body.length() > 50) {
			shortContent = "${body.substring(0, 50)}..."
		}
		shortContent = body
	}

	def beforeUpdate() {
		if(this.isDirty('body')) {
			if(body.length() > 50) {
				shortContent = "${body.substring(0, 50)}..."
			}
			shortContent = body
		}

	}
	
}
