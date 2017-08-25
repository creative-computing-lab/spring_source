package sgsp.push

import sgsp.sec.User

// User와 1:N
//
class PushTarget {
	// 기기 아이디
	String deviceId

	// 푸시토큰
	String token

	// 수신동의
	boolean isAgreeSend = true

	// 만료여부
	boolean isExpire = false

	// 생성, 갱신 일시
	Date dateCreated
	Date lastUpdated

	// 사용자
	static belongsTo = [owner : User]

	static constraints = {
		deviceId blank: false, unique: true
		token nullable : true
		owner nullable : true
	}

	static mapping = { 
		deviceId length : 64
		version false
	}

	boolean ownerChanged = false

	static transients = ['ownerChanged']

	def beforeUpdate() {
		ownerChanged = this.isDirty('owner')
	}

	def afterUpdate() {
		// owner가 변경되면, 다른 target을 만료
		if (ownerChanged) {
			try {
				def query = "update PushTarget b set b.owner=null where b.owner=:owner and b.deviceId<>:deviceId"
				PushTarget.executeUpdate(query,[owner:this.owner, deviceId:this.deviceId])
			} catch(e) {
				log.error "PushTarget executeUpdate fail... ${e}"
			}
		}
	}
}
