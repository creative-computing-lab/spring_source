package sgsp

import grails.plugin.springsecurity.annotation.Secured
import sgsp.common.ResultUtil
import sgsp.common.SgspException
import sgsp.data.ResultCode

class OpposeController {

	def opposeService

	@Secured(value=['ROLE_ADMIN'])
	def list() {
		def results = null
		try {
			results = opposeService.list(params)
		} catch (e) {
			log.error(e.toString())
			return render(ResultUtil.makeResponse('-1', [msg : '조회 중 오류.']))
		}
		return render(ResultUtil.makeResponse('0', results))
	}
}
