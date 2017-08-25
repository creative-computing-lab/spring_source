package sgsp

import grails.plugin.springsecurity.annotation.Secured
import sgsp.common.ResultUtil

class MoodController {

	def springSecurityService
	def moodService

	@Secured(value=['ROLE_USER', 'ROLE_COUNSELOR'])
	def mylist() {
		def results = null
		try {
			results = moodService.mylist(params)
		} catch (e) {
			log.error(e.toString())
			return render(ResultUtil.makeResponse('-1', [msg : '조회 중 오류.']))
		}
		return render(ResultUtil.makeResponse('0', results))
	}
	
	@Secured(value=['ROLE_ADMIN'])
	def list() {
		def results = null
		try {
			results = moodService.list(params)
			println results
		} catch (e) {
			log.error(e.toString())
			return render(ResultUtil.makeResponse('-1', [msg : '조회 중 오류.']))
		}
		return render(ResultUtil.makeResponse('0', results))
	}
}
