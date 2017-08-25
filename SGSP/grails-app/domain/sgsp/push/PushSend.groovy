package sgsp.push

import sgsp.data.SendStatus
import sgsp.data.SendToType
import sgsp.data.PushMessageType
import sgsp.sec.User

class PushSend {
	// 전송 상태
	SendStatus status = SendStatus.CREATED

	// 전송 대상
	SendToType toType = SendToType.ALL
	
	// 메시지 타입
	PushMessageType pushMessageType = PushMessageType.TEXT
	
	// 전송 대상이 ETC일때, "id;id;id;"
	String toIds
	
	// 준비완료 (CREATED -> READY_TO_SEND)
	Date datePrepare
	// 발송시작 (READY_TO_SEND -> SENDING)
	Date dateBegin
	// 발송완료 (SENDING -> DONE)
	Date dateSent

	String shortContent

	String body
	
	String link

	// 실패시 에러메시지
	String failReason

	// 삭제여부
	boolean isRemoved = false
	
	// 스케줄러에 인해 작업중
	boolean isWorking = false

	// 생성, 갱신 일시
	Date dateCreated
	Date lastUpdated


	// 발송자
	static belongsTo = [owner : User]

	static hasMany = [messages:PushMessage]

	static constraints = {
		toIds nullable : true
		datePrepare nullable : true
		dateBegin nullable : true
		dateSent nullable : true
		failReason nullable : true
		shortContent nullable : true
		link nullable : true
	}

	static mapping = {
		status enumType:"string"
		toType enumType:"string"
		pushMessageType enumType:"string"
		shortContent length: 200
		failReason length : 200
		body type : 'text'
		toIds type : 'text'
		version false
	}

	// insert 전
	def beforeInsert() {
		copyContent()
	}

	// update 전
	def beforeUpdate() {
		if(this.isDirty('body')) {
			copyContent()
		}
	}

	private void copyContent() {
		if(body.length() > 50) {
			shortContent = "${body.substring(0, 50)}..."
		}
		shortContent = body
	}
}
