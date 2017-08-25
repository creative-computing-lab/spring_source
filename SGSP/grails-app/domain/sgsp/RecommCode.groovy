package sgsp

import sgsp.sec.User

class RecommCode {

	String code
	// 설명
	String description
	// 만료일
	Date dateExpire
	// 사용여부
	boolean isUsed = true
	// 삭제여부
	boolean isRemoved = false

	Date dateCreated
	Date lastUpdated

	// 사용자
	static belongsTo = [owner : User]
	
	static constraints = {
		code blank: false, unique: true
		description nullable : true
		dateExpire nullable : true
	}
	static mapping = {
		code length : 64
		version false
	}
}
