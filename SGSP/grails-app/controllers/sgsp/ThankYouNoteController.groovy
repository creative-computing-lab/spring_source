package sgsp

import grails.plugin.springsecurity.annotation.Secured
import sgsp.common.ResultUtil

class ThankYouNoteController {

	def thankYouNoteService

	@Secured(value=['ROLE_USER', 'ROLE_COUNSELOR'])
	def mylist() {
		def results = null
		try {
			results = thankYouNoteService.mylist(params)
		} catch (e) {
			log.error(e.toString())
			return render(ResultUtil.makeResponse('-1', [msg : '조회 중 오류.']))
		}
		return render(ResultUtil.makeResponse('0', results))
	}
	
	@Secured(value=['ROLE_COUNSELOR'])
	def myRecvlist() {
		def results = null
		try {
			results = thankYouNoteService.myRecvlist(params)
		} catch (e) {
			log.error(e.toString())
			return render(ResultUtil.makeResponse('-1', [msg : '조회 중 오류.']))
		}
		return render(ResultUtil.makeResponse('0', results))
	}
	
	@Secured(value=['ROLE_USER', 'ROLE_COUNSELOR'])
	def item() {
		def seq = params.long('seq', 0)
		if(seq > 0) {
			def result = null
			try {
				result = thankYouNoteService.item(seq)
			} catch (e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse('-1', [msg : '조회 중 오류.']))
			}
			return render(ResultUtil.makeResponse('0', result))
		}
		render status: 400
	}
	
	@Secured(value=['ROLE_USER', 'ROLE_COUNSELOR'])
	def create() {
		if ( request.method == 'POST' ) {
			def commentSeq = params.long('commentSeq', 0)
			def jsonObject = request.JSON
			if(jsonObject) {
				try {
					thankYouNoteService.create(commentSeq, jsonObject)
				} catch (e) {
					log.error(e.toString())
					return render(ResultUtil.makeResponse('-1', [msg : '생성 중 오류.']))
				}
				return render (ResultUtil.makeResponse())
			}
		}
		render status: 400
	}
	
	@Secured(value=['ROLE_USER', 'ROLE_COUNSELOR'])
	def markAsRead() {
		def seq = params.long('seq', 0)
		if(seq > 0) {
			try {
				thankYouNoteService.markAsRead(seq)
			} catch (e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse('-1', [msg : '갱신 중 오류.']))
			}
			return render (ResultUtil.makeResponse('0', [msg : '갱신하였습니다.']))
		}
		render status: 400
	}
	
	
}
