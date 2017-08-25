package sgsp

import grails.plugin.springsecurity.annotation.Secured
import sgsp.common.ResultUtil

class RecommCodeController {

	def recommCodeService;

	@Secured(value=['ROLE_ADMIN'])
	def list() {
		def results = null
		try {
			results = recommCodeService.list(params)
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
				result = recommCodeService.item(seq)
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
				recommCodeService.create(jsonObject)
			} catch (e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse('-1', [msg : '생성 중 오류.']))
			}
			return render (ResultUtil.makeResponse())
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
					recommCodeService.update(seq, jsonObject)
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
				recommCodeService.remove(seq)
			} catch (e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse('-1', [msg : '삭제 중 오류.']))
			}
			return render (ResultUtil.makeResponse('0', [msg :'삭제하였습니다.']))
		}
		render status: 400
	}
	
	def isAvailable() {
		def jsonObject = request.JSON
		if(jsonObject) {
			boolean result = false
			try {
				result = recommCodeService.isAvailable(jsonObject)
			} catch (e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse('-1', [msg : '조회 중 오류']))
			}
			return render (ResultUtil.makeResponse('0', [isAvailable :result]))
		}
		render status: 400
	}
}
