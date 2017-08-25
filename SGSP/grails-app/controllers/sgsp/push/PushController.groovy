package sgsp.push

import grails.plugin.springsecurity.annotation.Secured
import org.codehaus.groovy.grails.web.json.JSONObject
import sgsp.common.ResultUtil

class PushController {

	def pushTargetService

	def pushSendBoxService

	// device id, push token
	def putDevice() {
		def jsonObject = request.JSON
		if(jsonObject) {
			try {
				// pushTargetService.putDevice(jsonObject)
				
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
			} catch (e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse('-1', [msg : '기기정보 입력 중 오류.']))
			}
			return render (ResultUtil.makeResponse())
		}
		render status: 400
	}

	private save(obj) {
		if(!(obj.validate() && obj.save())) {
			obj.errors.allErrors.each { log.error it }
			throw new IllegalArgumentException(obj.errors.allErrors.join(" "))
		}
	}
	
	// device id 와 user를 연결
	@Secured(value=['ROLE_USER', 'ROLE_COUNSELOR'], httpMethod='POST')
	def updateDevice() {
		JSONObject jsonObject = request.JSON
		if(jsonObject && jsonObject.get('deviceId')!=JSONObject.NULL) {
			try {
				pushTargetService.updateDevice(jsonObject.deviceId)
			} catch (e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse('-1', [msg : '기기정보 입력 중 오류.']))
			}
			return render (ResultUtil.makeResponse())
		}
		render status: 400
	}

	// 수신 동의
	@Secured(value=['ROLE_USER', 'ROLE_COUNSELOR'], httpMethod='POST')
	def getIsArgee() {
		def deviceId = params.deviceId
		if(deviceId) {
			try {
				def result = pushTargetService.getIsArgee(deviceId)
				return render(ResultUtil.makeResponse('0', result))
			} catch (e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse('-1', [msg : '기기정보 입력 중 오류.']))
			}
		}
		render status: 400
	}

	@Secured(value=['ROLE_USER', 'ROLE_COUNSELOR'], httpMethod='POST')
	def updateIsArgee() {
		JSONObject jsonObject = request.JSON
		if(jsonObject && jsonObject.get('isAgree')!=JSONObject.NULL) {
			try {
				pushTargetService.updateIsArgee(jsonObject.isAgree)
			} catch (e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse('-1', [msg : '기기정보 입력 중 오류.']))
			}
			return render (ResultUtil.makeResponse())
		}
		render status: 400
	}

	/////////////////////////////

	@Secured(value=['ROLE_ADMIN'])
	def list() {
		def results = null
		try {
			results = pushSendBoxService.list(params)
			println results
		} catch (e) {
			log.error(e.toString())
			return render(ResultUtil.makeResponse('-1', [msg : '조회 중 오류.']))
		}
		return render(ResultUtil.makeResponse('0', results))
	}

	@Secured(value=['ROLE_ADMIN'])
	def item() {
		def seq = params.long('seq', 0)
		if(seq > 0) {
			def result = null
			try {
				result = pushSendBoxService.item(seq)
			} catch (e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse('-1', [msg : '조회 중 오류.']))
			}
			return render(ResultUtil.makeResponse('0', result))
		}
		render status: 400
	}

	@Secured(value=['ROLE_ADMIN'], httpMethod='POST')
	def create() {
		def jsonObject = request.JSON
		if(jsonObject) {
			try {
				def id = pushSendBoxService.create(jsonObject)
				return render (ResultUtil.makeResponse('0', [seq : id]))
			} catch (e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse('-1', [msg : '생성 중 오류.']))
			}
		}
		render status: 400
	}

	@Secured(value=['ROLE_ADMIN'], httpMethod='POST')
	def update() {

		def seq = params.long('seq', 0)
		if(seq > 0) {
			def jsonObject = request.JSON
			if ( jsonObject ) {
				try {
					pushSendBoxService.update(seq, jsonObject)
				} catch (e) {
					log.error(e.toString())
					return render(ResultUtil.makeResponse('-1', [msg : '갱신 중 오류.']))
				}
				return render (ResultUtil.makeResponse('0', [msg : '갱신하였습니다.']))
			}
		}
		render status: 400
	}

	@Secured(value=['ROLE_ADMIN'], httpMethod='POST')
	def remove() {
		def seq = params.long('seq', 0)
		if(seq > 0) {
			try {
				pushSendBoxService.remove(seq)
			} catch (e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse('-1', [msg : '삭제 중 오류.']))
			}
			return render (ResultUtil.makeResponse('0', [msg :'삭제하였습니다.']))
		}
		render status: 400
	}

	@Secured(value=['ROLE_ADMIN'], httpMethod='POST')
	def send() {
		def seq = params.long('seq', 0)
		if(seq > 0) {
			try {
				pushSendBoxService.updateToSend(seq)
			} catch (e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse('-1', [msg : '갱신 중 오류.']))
			}
			return render (ResultUtil.makeResponse('0', [msg : '갱신하였습니다.']))

		}
		render status: 400
	}

	@Secured(value=['ROLE_ADMIN'], httpMethod='POST')
	def cancelSend() {
		def seq = params.long('seq', 0)
		if(seq > 0) {
			try {
				pushSendBoxService.updateToCancelSend(seq)
			} catch (e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse('-1', [msg : '갱신 중 오류.']))
			}
			return render (ResultUtil.makeResponse('0', [msg : '갱신하였습니다.']))

		}
		render status: 400
	}
}
