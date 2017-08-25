package sgsp.data

enum Career {
	LESS_THEN_1_YEAR(1, '1년 미만'),
	_1_3_YEARS(2, '1~3년'),
	_3_5_YEARS(3, '3~5년'),
	MORE_THEN_5_YEARS(4, '5년 이상')

	private final def code
	private final def displayName
	Career(code, displayName) {
		this.code = code
		this.displayName = displayName
	}
}
