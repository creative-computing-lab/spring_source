package sgsp.data

enum PushMessageType {
	TEXT(1, '단순 메시지'),
	LINK(2, '링크 메시지'),
	
	private final def code
	private final def displayName
	
	PushMessageType(code, displayName) {
		this.code = code
		this.displayName = displayName
	} 
}
