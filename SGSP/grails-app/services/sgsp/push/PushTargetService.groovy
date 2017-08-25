package sgsp.push

import grails.transaction.Transactional

import org.codehaus.groovy.grails.web.json.JSONObject

import sgsp.common.SgspException
import sgsp.data.ResultCode

@Transactional
class PushTargetService {

	def springSecurityService

	// 초기 기기 정보를 입력
	def putDevice(JSONObject jsonObject) {
		PushTarget obj
		println jsonObject
		if(jsonObject.get('deviceId') != JSONObject.NULL && jsonObject.get('token') != JSONObject.NULL) {
			def deviceId = jsonObject.get('deviceId')
			if(deviceId) {
				obj = PushTarget.findByDeviceId(deviceId)
				if(obj == null) {
					obj = new PushTarget('deviceId':deviceId)
				}
				
				obj.token = jsonObject.get('token')
				if(jsonObject.get('isAgreeSend') != JSONObject.NULL) {
					obj.isAgreeSend = jsonObject.get('isAgreeSend')
				}
				save(obj)
			}
		}
		return true
	}

	private save(obj) {
		if(!(obj.validate() && obj.save())) {
			obj.errors.allErrors.each { log.error it }
			throw new IllegalArgumentException(obj.errors.allErrors.join(" "))
		}
	}

	// 로그인 이후, 기기와 사용자를 연결할때, 사용
	def updateDevice(deviceId) {
		println deviceId
		def user = springSecurityService.currentUser
		PushTarget obj = PushTarget.findByDeviceId(deviceId)
		if(obj) {
			obj.owner = user
			if(obj.isDirty('owner')) {
				if(!(obj.validate() && obj.save())) {
					obj.errors.allErrors.each { log.error it }
					throw new IllegalArgumentException(obj.errors.allErrors.join(" "))
				}
			}
		}

		return true
	}

	def getIsArgee(deviceId) {
		PushTarget obj = PushTarget.findByDeviceId(deviceId)
		if(obj) {
			return ['isAgreeSend' : obj.isAgreeSend]
		} else {
			throw new SgspException(ResultCode.NO_DATA, "기기 정보가 없습니다.");
		}
	}

	def updateIsArgee(deviceId, isAgree) {
		PushTarget obj = PushTarget.findByDeviceId(deviceId)
		if(obj) {
			obj.isAgreeSend = isAgree
			if(!(obj.validate() && obj.save())) {
				obj.errors.allErrors.each { log.error it }
				throw new IllegalArgumentException(obj.errors.allErrors.join(" "))
			}
		}
	}
}
