package sgsp.data

enum PostsCategory {
	STUDY(1, '학업'),
	WORK(2, '일'),
	FAMILY(3, '가족'),
	LOVE(4, '연애'),
	FRIEND(5, '친구'),
	PARENTING(6, '육아'),
	ETC(100, '기타')

	private final def code
	private final def displayName
	PostsCategory(code, displayName) {
		this.code = code
		this.displayName = displayName
	}
}
