package sgsp.data

enum Degree {
	MASTERS_COURSE(1, '석사과정'),
	MASTERS_DEGREE(2, '석사졸업'),
	DOCTERS_COURSE(3, '박사과정'),
	DOCTERS_DEGREE(4, '박사졸업')

	private final def code
	private final def displayName
	Degree(code, displayName) {
		this.code = code
		this.displayName = displayName
	}
}
