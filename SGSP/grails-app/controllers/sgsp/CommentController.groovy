package sgsp

import grails.plugin.springsecurity.annotation.Secured
import sgsp.common.ResultUtil
import sgsp.common.SgspException
import sgsp.data.ResultCode

class CommentController {

	def commentService

	def list() {
		def results = null
		try {
			results = commentService.list(params)
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
				result = commentService.item(seq)
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
		def postsSeq = params.long('postsSeq', 0)
		def jsonObject = request.JSON
		if(jsonObject) {
			try {
				commentService.create(postsSeq, jsonObject)
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
		if(seq > 0) {
			def jsonObject = request.JSON
			if ( jsonObject ) {
				try {
					commentService.update(seq, jsonObject)
				} catch (e) {
					log.error(e.toString())
					return render(ResultUtil.makeResponse('-1', [msg : '갱신 중 오류.']))
				}
				return render (ResultUtil.makeResponse('0', [msg : '갱신하였습니다.']))
			}
		}
		render status: 400
	}

	@Secured(value=['ROLE_USER', 'ROLE_COUNSELOR'], httpMethod='POST')
	def remove() {
		def seq = params.long('seq', 0)
		if(seq > 0) {
			try {
				commentService.remove(seq)
			} catch (e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse('-1', [msg : '삭제 중 오류.']))
			}
			return render (ResultUtil.makeResponse('0', [msg :'삭제하였습니다.']))
		}
		render status: 400
	}

	// 댓글채택
	@Secured(value=['ROLE_USER', 'ROLE_COUNSELOR'], httpMethod='POST')
	def sprout() {
		def seq = params.long('seq', 0)
		if(seq > 0) {
			def jsonObject = request.JSON
			if ( jsonObject ) {
				try {
					commentService.sprout(seq, jsonObject)
				} catch (SgspException e) {
					log.error(e.toString())
					return render(ResultUtil.makeResponse(e.resultCode, [msg : e.message]))
				}  catch (Exception e) {
					log.error(e.toString())
					return render(ResultUtil.makeResponse('-1', [msg : '댓글채택 중 오류.']))
				}
				return render (ResultUtil.makeResponse('0', [msg :'댓글채택하였습니다.']))
			}
		}
		render status: 400
	}
	
	@Secured(value=['ROLE_USER', 'ROLE_COUNSELOR'], httpMethod='POST')
	def recomm() {
		def seq = params.long('seq', 0)
		if(seq > 0) {
			try {
				commentService.recomm(seq)
			} catch (SgspException e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse(e.resultCode, [msg : e.message]))
			}  catch (Exception e) {
				log.error(e.toString())
				return render(ResultUtil.makeResponse(ResultCode.FAIL, [msg : '댓글 추천 중 오류']))
			}
			return render (ResultUtil.makeResponse())
		}
		render status: 400
	}

	@Secured(value=['ROLE_USER', 'ROLE_COUNSELOR'], httpMethod='POST')
	def cancelRecomm() {
		def seq = params.long('seq', 0)
		if(seq > 0) {
			try {
				commentService.cancelRecomm(seq)
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
}
