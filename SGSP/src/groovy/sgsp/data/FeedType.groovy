package sgsp.data

enum FeedType {
	COMMENT(1, '댓글'),
	RECOMM(2, '공감'),
	BUD(3, '댓글채택'),
	CANCEL_BUD(4, '댓글채택취소'),

	private final def code
	private final def displayName
	FeedType(code, displayName) {
		this.code = code
		this.displayName = displayName
	}
}
