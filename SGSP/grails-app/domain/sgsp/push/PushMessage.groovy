package sgsp.push

import sgsp.Feed
import sgsp.data.SendStatus
import sgsp.sec.User

class PushMessage {
	// 전송 상태
	SendStatus status = SendStatus.CREATED
	// 발송완료
	Date dateSent
	// 푸시토큰
	String token

	// 생성, 갱신 일시
	Date dateCreated
	Date lastUpdated

	static belongsTo = [send : PushSend, feed : Feed, to:User]
	
	static constraints = {
		dateSent nullable : true
		send nullable : true
		feed nullable : true
	}
	
	static mapping = {
		status enumType:"string"
		version false
	}
}
