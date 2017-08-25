package sgsp.data

enum SendToType {
	ALL(1, '모두'),
	TO_NORMAL(2, '일반사용자'),
	TO_COUNSELOR(3, '상담자'),
	TO_ETC(4, '기타')

	private final def code
	private final def displayName
	SendToType(code, displayName) {
		this.code = code
		this.displayName = displayName
	} 
}
