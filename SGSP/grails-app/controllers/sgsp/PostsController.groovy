package sgsp

import grails.plugin.springsecurity.SpringSecurityUtils
import grails.plugin.springsecurity.annotation.Secured
import sgsp.common.ResultUtil
import sgsp.common.SgspException
import sgsp.data.ResultCode

class PostsController {

	def springSecurityService
	def postsService
	def recommService

	def list() {
		def results = null
		try {
			results = postsService.list(params)
		} catch (e) {
			log.error(e.toString())
			return render(ResultUtil.makeResponse('-1', [msg : '조회 중 오류.']))
		}
		return render(ResultUtil.makeResponse('0', results))
	}

	@Secured(value=['ROLE_USER', 'ROLE_COUNSELOR'])
	def mylist() {
		def results = null
		try {
			results = postsService.mylist(params)
		} catch (e) {
			log.error(e.toString())
			return render(ResultUtil.makeResponse('-1', [msg : '조회 중 오류.']))
		}
		return render(ResultUtil.makeResponse('0', results))
	}

	@Secured(value=['ROLE_COUNSELOR'])
	def myCounselinglist() {
		def results = null
		try {
			results = postsService.myCounselinglist(params)
		} catch (e) {
			log.error(e.toString())
			return render(ResultUtil.makeResponse('-1', [msg : '조회 중 오류.']))
		}
		return render(ResultUtil.makeResponse('0', results))
	}

	@Secured(value=['ROLE_COUNSELOR'])
	def myCounselingCount() {
		def results = null
		try {
			results = postsService.myCounselingCount()
			println results
		} catch (e) {
			log.error(e.toString())
			return render(ResultUtil.makeResponse('-1', [msg : '조회 중 오류.']))
		}
		return render(ResultUtil.makeResponse('0', results))
	}

	def item() {
		def seq = params.long('seq', 0)
		if(seq > 0) {
			def result = null
			try {
				result = postsService.item(seq)
			} catch (e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse('-1', [msg : '조회 중 오류.']))
			}
			return render(ResultUtil.makeResponse('0', result))
		}
		render status: 400
	}

	@Secured(value=['ROLE_USER', 'ROLE_COUNSELOR'], httpMethod='POST')
	def create() {
		def jsonObject = request.JSON
		// log.info(jsonObject)

		if(jsonObject) {
			try {
				postsService.create(jsonObject)
			} catch (e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse('-1', [msg : '생성 중 오류.']))
			}
			return render (ResultUtil.makeResponse())
		}
		render status: 400
	}

	@Secured(value=['ROLE_USER', 'ROLE_COUNSELOR'], httpMethod='POST')
	def update() {
		def seq = params.long('seq', 0)
		// log.info('seq:' + seq)

		if(seq > 0) {
			def jsonObject = request.JSON
			// log.info(jsonObject)

			if ( jsonObject ) {
				try {
					postsService.update(seq, jsonObject)
				} catch (e) {
					log.error(e.toString())
					return render(ResultUtil.makeResponse('-1', [msg : '갱신 중 오류.']))
				}
				return render (ResultUtil.makeResponse('0', [msg : '갱신하였습니다.']))
			}
		}
		render status: 400
	}

	@Secured(value=['ROLE_USER', 'ROLE_COUNSELOR', 'ROLE_ADMIN'], httpMethod='POST')
	def remove() {
		def seq = params.long('seq', 0)
		if(seq > 0) {
			try {
				postsService.remove(seq)
			} catch (e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse('-1', [msg : '삭제 중 오류.']))
			}
			return render (ResultUtil.makeResponse('0', [msg :'삭제하였습니다.']))
		}
		render status: 400
	}

	@Secured(value=['ROLE_USER', 'ROLE_COUNSELOR'], httpMethod='POST')
	def recomm() {
		def seq = params.long('postsSeq', 0)
		if(seq > 0) {

			try {
				postsService.recomm(seq)
			} catch (SgspException e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse(e.resultCode, [msg : e.message]))
			}  catch (Exception e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse(ResultCode.FAIL, [msg : '글추천 중 오류']))
			}
			return render (ResultUtil.makeResponse())
		}
		render status: 400
	}
	
	@Secured(value=['ROLE_USER', 'ROLE_COUNSELOR'], httpMethod='POST')
	def cancelRecomm() {
		def seq = params.long('postsSeq', 0)
		if(seq > 0) {
			try {
				postsService.cancelRecomm(seq)
			} catch (SgspException e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse(e.resultCode, [msg : e.message]))
			}  catch (Exception e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse(ResultCode.FAIL, [msg : '댓글 추천 취소 중 오류']))
			}
			return render (ResultUtil.makeResponse())
		}
		render status: 400
	}

	@Secured(value=['ROLE_USER', 'ROLE_COUNSELOR'], httpMethod='POST')
	def oppose() {
		def seq = params.long('postsSeq', 0)
		if(seq > 0) {
			try {
				postsService.oppose(seq)
			} catch (SgspException e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse(e.resultCode, [msg : e.message]))
			}  catch (Exception e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse(ResultCode.FAIL, [msg : '작업 중 오류']))
			}
			return render (ResultUtil.makeResponse())
		}
		render status: 400
	}
}
