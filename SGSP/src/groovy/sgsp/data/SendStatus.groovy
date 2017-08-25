package sgsp.data

enum SendStatus {
	CREATED(1, '생성됨'),
	PREPARING(2, '전송 준비중'),
	READY_TO_SEND(3, '전송대기'),
	SENDING(4, '전송중'),
	CANCEL_SENDING(11, '전송취소됨'),
	DONE(5, '완료')

	private final def code
	private final def displayName
	SendStatus(code, displayName) {
		this.code = code
		this.displayName = displayName
	}
}
