package sgsp

import grails.transaction.Transactional
import sgsp.common.SgspException
import sgsp.data.ResultCode
import sgsp.data.UserDiv
import sgsp.sec.User

@Transactional
class CommentService {

	def springSecurityService

	def list(params) {
		def postsId = params.long('postsSeq', 0)

		Posts posts = null
		boolean isPostsOwner = false
		def currentUser = springSecurityService.currentUser

		if(postsId > 0) {
			posts = Posts.get(postsId)
			if(posts) {
				isPostsOwner = (posts.owner == currentUser)
			}
		}

		params.max = Math.min(params.max ? params.int('max') : 10, 100)
		params.offset = params.offset?params.int('offset') :0
		params.sort = params.sort?params.sort:'id'
		params.order = params.order?params.order:'asc'

		def results = Comment.createCriteria().list(max: params.max, offset: params.offset) {
			createAlias('owner', 'owner')
			projections {
				property('id', 'id')
				property('shortContent', 'shortContent')
				property('isSprout', 'isSprout')
				property('lastUpdated', 'lastUpdated')
				property('owner.id', 'ownerId')
				property('owner.userDiv', 'ownerUserDiv')
				property('owner.username', 'ownerUsername')
			}
			and {
				eq 'posts', posts
				eq 'isRemoved', false
			}
			order params.sort, params.order
		}
		return [list: results.collect {
				int i = 0
				boolean isSprout = it[2]
				boolean isCommentOwner = it[4] == currentUser?.id
				def sprout = 'null'
				// 새싹댓글
				if(isSprout) {
					sprout = 'done'
				} else {
					// 글 주인이 댓글을 볼때
					if(isPostsOwner) {
						// 본인의 댓글이 아닐경우만
						if(!isCommentOwner) {
							sprout = 'able'
						}
					}
				}

				// 글 쓴 본인의 댓글이 아닌 상담자의 댓글인 경우, 이름 표시
				def username = ""
				UserDiv userDiv = it[5]
				if(!(posts.owner.id == it[4]) && userDiv == UserDiv.COUNSELOR) {
					username = it[6]
				}

				[
					'id':it[0],
					'body':it[1],
					'sprout':sprout,
					'lastUpdated':it[3],
					'username':username,
					'recommTotal' : CommentRecomm.countByComment(Comment.load(it[0])),
					'isRecomm' : CommentRecomm.countByCommentAndOwner(Comment.load(it[0]), currentUser)>0
				]
			}, count:results?.size(), total: results?.getTotalCount(), isOwner:isPostsOwner]
	}

	def item(seq) {
		if(seq > 0) {
			def currentUser = springSecurityService.currentUser
			Comment comment = Comment.get(seq)
			boolean isPostsOwner = (comment.posts.owner == currentUser)
			boolean isCommentOwner = comment.owner == currentUser
			def sprout = 'null'

			// 새싹댓글
			if(comment.isSprout) {
				sprout = 'done'
			} else {
				// 글 주인이 댓글을 볼때
				if(isPostsOwner) {
					// 본인의 댓글이 아닐경우만
					if(!isCommentOwner) {
						sprout = 'able'
					}
				}
			}

			// 글 쓴 본인의 댓글이 아닌 상담자의 댓글인 경우, 이름 표시
			def username = ""
			UserDiv userDiv = comment.owner.userDiv
			if(!(comment.posts.owner.id == comment.owner.id) && userDiv == UserDiv.COUNSELOR) {
				username = comment.owner.username
			}

			return [
				'id':comment.id,
				'body':comment.body,
				'sprout':sprout,
				'lastUpdated':comment.lastUpdated,
				'username':username,
				'recommTotal' : CommentRecomm.countByComment(Comment.load(comment.id)),
				'isRecomm' : CommentRecomm.countByCommentAndOwner(Comment.load(comment.id), currentUser)>0
			]
		}
		return null
	}

	def create(postsSeq, jsonObject) {

		def user = springSecurityService.currentUser

		def posts = Posts.get(postsSeq)

		def comment = new Comment(jsonObject)

		comment.owner = user
		comment.posts = posts

		if(!(comment.validate() && comment.save())) {
			comment.errors.allErrors.each { log.error it }
			throw new IllegalArgumentException(comment.errors.allErrors.join(" "))
		}

		if(comment.id > 0) {
			posts.addToComments(comment)
			posts.save()
		}

		return true
	}

	def update(seq, jsonObject) {
		def currentUser = springSecurityService.currentUser
		if(seq > 0) {
			Comment comment = Comment.find {
				(id == seq) && (owner == currentUser)
			}
			if(comment) {
				comment.properties = jsonObejct
				if(!(comment.validate() && comment.save())) {
					comment.errors.allErrors.each { log.error it }
					throw new IllegalArgumentException(comment.errors.allErrors.join(" "))
				}
			}
		}
		return true
	}


	def remove(seq) {
		def currentUser = springSecurityService.currentUser
		if(seq > 0) {
			Comment comment = Comment.find {
				(id == seq) && (owner == currentUser)
			}
			if(comment) {
				if(comment.isSprout==false) {
					comment.isRemoved = true
					if(!(comment.validate() && comment.save())) {
						comment.errors.allErrors.each { log.error it }
						throw new IllegalArgumentException(comment.errors.allErrors.join(" "))
					}
				} else {
					throw new SgspException(ResultCode.FAIL, "채택된 댓글은 삭제할수 없습니다");
				}
			}
		}
		return true
	}

	def sprout(seq, jsonObject) {
		def currentUser = springSecurityService.currentUser
		if(seq > 0) {
			// 댓글채택이 가능?
			Comment comment = Comment.get(seq)
			if(comment) {

				if(currentUser == comment.owner) {
					throw new SgspException(ResultCode.FAIL, "자신의 댓글을 채택할 수 없습니다.");
				}

				if(currentUser != comment.posts.owner) {
					throw new SgspException(ResultCode.FAIL, "자신의 글의 댓글 중에 채택할 수 있습니다.");
				}

				// 채택여부
				if(comment.isSprout) {
					throw new SgspException(ResultCode.SPROUT_ALREADY, "이미 채택하였습니다.");
				}

				Posts posts = comment.posts
				if(posts.isSprout) {
					// 이전 새싹이 있다면 해제
					Comment sproutedComment = posts.sproutedComment
					if(sproutedComment) {
						removeSprout(sproutedComment)
					}
				}
				// 댓글
				comment.isSprout = true
				comment.save()
				// 글
				posts.isSprout = true
				posts.sproutedComment = comment
				posts.save()
				// 새싹 insert
				Sprout sprout = new Sprout()
				sprout.owner = comment.owner
				sprout.comment = comment
				sprout.from = comment.posts.owner
				sprout.save()
				// 기분 입력
				Mood mood = new Mood(jsonObject.mood)
				mood.owner = currentUser
				mood.posts = comment.posts
				mood.comment = comment
				mood.isFirst = false
				if(!(mood.validate() && mood.save())) {
					mood.errors.allErrors.each { log.error it }
					throw new IllegalArgumentException(mood.errors.allErrors.join(" "))
				}
				return true
			}
		}
		return false
	}

	def cancelSprout(seq) {
		def currentUser = springSecurityService.currentUser
		if(seq > 0) {
			// 댓글채택취소가 가능?
			Comment comment = Comment.get(seq)
			if(comment &&
			currentUser != comment.owner && // 다른사람의 댓글인지
			currentUser == comment.posts.owner) { // 본인 글의 댓글인지
				return removeSprout(comment)
			}
		}
		return false
	}

	private def removeSprout(Comment comment) {
		// 채택여부
		if(comment.isSprout == true) {
			Posts posts = comment.posts
			if(posts.isSprout && posts.sproutedComment == comment) {
				comment.isSprout=false
				comment.save()
				Sprout sprout = Sprout.findByComment(comment)
				if(sprout) {
					sprout.isRemoved=true
					sprout.memo = '댓글채택취소'
					sprout.save()
				}
				posts.isSprout = false
				posts.isSentThankYouNote = false
				posts.sproutedComment = null
				posts.save()
				return true
			}

		} else{
			throw new SgspException(ResultCode.FAIL, "채택된 댓글이 아닙니다.");
		}
		return false
	}

	def recomm(seq) {
		def user = springSecurityService.currentUser
		Comment comment = Comment.get(seq)
		if(comment) {
			def exist = CommentRecomm.findWhere(owner:user, comment:comment)
			if(exist) {
				throw new SgspException(ResultCode.RECOMM_ALREADY, "이미 추천하였습니다.");
			}
			def recomm = new CommentRecomm()
			recomm.owner = user
			recomm.comment = comment

			if(recomm.validate()) {
				comment.addToRecomms(recomm).save()
				return true
			}
		}

		return false
	}

	def cancelRecomm(seq) {
		def user = springSecurityService.currentUser
		Comment comment = Comment.get(seq)
		if(comment) {
			def exist = CommentRecomm.findWhere(owner:user, comment:comment)
			if(!exist) {
				throw new SgspException(ResultCode.NO_DATA, "추천된 댓글이 아닙니다.");
			} else {
				comment.removeFromRecomms(exist)
				exist.delete()
				return true
			}
		}
		return false
	}
}
