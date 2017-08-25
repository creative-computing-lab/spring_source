package sgsp

import grails.plugin.springsecurity.SpringSecurityUtils
import grails.plugin.springsecurity.annotation.Secured
import sgsp.common.ResultUtil

class FeedController {

	def feedService

	@Secured(value=['ROLE_USER', 'ROLE_COUNSELOR'])
	def mylist() {
		def results = null
		try {
			results = feedService.mylist(params)
		} catch (e) {
			log.error(e.toString())
			return render(ResultUtil.makeResponse('-1', [msg : '조회 중 오류.']))
		}
		return render(ResultUtil.makeResponse('0', results))
	}

	@Secured(value=['ROLE_USER', 'ROLE_COUNSELOR'], httpMethod='POST')
	def markAsRead() {
		def seq = params.long('seq', 0)
		if(seq > 0) {
			try {
				feedService.markAsRead(seq)
			} catch (e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse('-1', [msg : '갱신 중 오류.']))
			}
			return render (ResultUtil.makeResponse('0', [msg : '갱신하였습니다.']))
		}
		render status: 400
	}
}
