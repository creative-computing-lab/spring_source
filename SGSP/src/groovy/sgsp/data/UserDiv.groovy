package sgsp.data

enum UserDiv {
	NORMAL(1, '일반사용자'), COUNSELOR(2, '상담자'), ADMIN(3, '관리자')

	private final def code
	private final def displayName
	UserDiv(code, displayName) {
		this.code = code
		this.displayName = displayName
	}
}
