package sgsp

import grails.plugin.springsecurity.annotation.Secured
import sgsp.common.ResultUtil
import sgsp.common.SgspException
import sgsp.data.ResultCode

class UserController {

	def userService

	def register() {
		if (request.method == 'POST') {
			def jsonObject = request.JSON
			if(jsonObject) {
				try {
					userService.create(jsonObject)
				} catch (SgspException e) {
					log.error(e.toString())
					return render(ResultUtil.makeResponse(e.resultCode, [msg : e.message]))
				}  catch (Exception e) {
					log.error(e.toString())
					return render(ResultUtil.makeResponse('-1', [msg : '생성 중 오류.']))
				}
				return render (ResultUtil.makeResponse())
			}
		}
		render status: 400
	}

	def findPwd() {
		if (request.method == 'POST') {
			def jsonObject = request.JSON
			if(jsonObject) {
				try {
					def result = userService.findPwd(jsonObject)
					if(result) {
						return render(ResultUtil.makeResponse(ResultCode.SUCCESS, result))
					} else {
						return render(ResultUtil.makeResponse(ResultCode.FAIL, [msg : '사용자를 찾을 수 없습니다.']))
					}
				}  catch (Exception e) {
					log.error(e.toString())
					return render(ResultUtil.makeResponse(ResultCode.FAIL))
				}
				return render (ResultUtil.makeResponse(ResultCode.FAIL))
			}
		}
		render status: 400
	}

	def updatePwd() {
		if (request.method == 'POST') {
			def jsonObject = request.JSON
			if(jsonObject) {
				try {
					def result = userService.updatePwd(jsonObject)
					if(result) {
						return render(ResultUtil.makeResponse(ResultCode.SUCCESS, [msg : '정상적으로 변경되었습니다.']))
					}
				}  catch (SgspException e) {
					log.error(e.toString())
					return render(ResultUtil.makeResponse(e.resultCode, [msg : e.message]))
				}  catch (Exception e) {
					log.error(e.toString())
					return render(ResultUtil.makeResponse(ResultCode.FAIL))
				}
				return render (ResultUtil.makeResponse(ResultCode.FAIL))
			}
		}
		render status: 400
	}
	
	@Secured(value=['ROLE_ADMIN'])
	def list() {
		def results = null
		try {
			results = userService.list(params)
		} catch (e) {
			log.error(e.toString())
			return render(ResultUtil.makeResponse('-1', [msg : '조회 중 오류.']))
		}
		return render(ResultUtil.makeResponse('0', results))
	}
	
	def download() {
		if (request.method == 'GET') {
			def token = params.token;
			
		}
		render status: 400
	}
}
