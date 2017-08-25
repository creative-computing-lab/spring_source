package sgsp

import java.util.Date;

import sgsp.data.FeedType
import sgsp.data.SendStatus;
import sgsp.data.SendToType;
import sgsp.push.PushMessage
import sgsp.sec.User

class Feed {
	// 댓글, 공감
	FeedType type
	// 읽었는지
	boolean isRead = false
	// 관련글
	Posts posts
	// 화면에 표시될 간략한 글내용
	String title
	String shortContent

	Date dateCreated
	Date lastUpdated

	// 전송 상태
	SendStatus status
	// 발송시작 (READY_TO_SEND -> SENDING)
	Date dateBegin
	// 발송완료 (SENDING -> DONE)
	Date dateSent
	
	// 실패시 에러메시지
	String failReason

	// 보내는사람 (작성자)
	static belongsTo = [owner : User]

	static constraints = {
		shortContent nullable : true
		posts nullable : true
		status nullable : true
		dateSent nullable : true
		dateBegin nullable : true
		failReason nullable : true
	}

	static mapping = {
		type enumType:"string"
		shortContent length: 200
		failReason length : 200
		version false
	}

	def beforeInsert() {
		if(this.type == FeedType.COMMENT || this.type == FeedType.RECOMM) {
			shortContent = posts?posts.title:''
		}
		if(this.type == FeedType.BUD || this.type == FeedType.COMMENT || this.type == FeedType.RECOMM) {
			status = SendStatus.PREPARING
		} else {
			status = null
		}
	}
}
