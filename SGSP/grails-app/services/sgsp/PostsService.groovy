package sgsp

import grails.transaction.Transactional
import sgsp.common.SgspException
import sgsp.data.ResultCode

import sgsp.data.UserDiv

@Transactional
class PostsService {

	def springSecurityService

	def list(params) {
		params.max = Math.min(params.max ? params.int('max') : 10, 100)
		params.offset = params.offset?params.int('offset') :0
		params.sort = params.sort?params.sort:'id'
		params.order = params.order?params.order:'desc'

		def results = Posts.createCriteria().list(max: params.max, offset: params.offset) {
			and {
				eq 'isPrivate', false
				eq 'isRemoved', false
			}
			order params.sort, params.order
		}

		def currentUser = springSecurityService.currentUser

		return [list: results.collect { Posts it ->
				[
					id : it.id,
					latitude : it.latitude,
					longitude : it.longitude,
					category : it.category.name(),
					categoryName : it.category.displayName,
					title : it.title,
					situations : it.situations,
					thoughts : it.thoughts,
					backgroundSeq : it.backgroundSeq,
					dateCreated : it.dateCreated,
					lastUpdated : it.lastUpdated,
					aboutWriter : it.owner.getAbout(),
					isOwner : it.owner==currentUser,
					commentTotal:Comment.countByPostsAndIsRemoved(it, false),
					recommTotal:it.recomms.size(),
					isRecomm : Recomm.countByPostsAndOwner(it, currentUser)>0
				]
			}, count:results?.size(), total: results?.getTotalCount()]
	}

	def mylist(params) {
		def user = springSecurityService.currentUser
		if(user!=null) {

			params.max = Math.min(params.max ? params.int('max') : 10, 100)
			params.offset = params.offset?params.int('offset') :0
			params.sort = params.sort?params.sort:'id'
			params.order = params.order?params.order:'desc'

			def results = Posts.createCriteria().list(max: params.max, offset: params.offset) {

				and {
					eq 'owner', user
					eq 'isRemoved', false
				}
				order params.sort, params.order
			}

			return [list: results.collect { Posts it -> toMyPostsMap(it) }, count:results?.size(), total: results?.getTotalCount()]
		}
		return null
	}
	
	
	def myCounselinglist(params) {
		def user = springSecurityService.currentUser
		if(user!=null) {

			params.max = Math.min(params.max ? params.int('max') : 10, 100)
			params.offset = params.offset?params.int('offset') :0
			params.sort = params.sort?params.sort:'id'
			params.order = params.order?params.order:'desc'

			def query = "FROM Posts A WHERE A.id in (SELECT C.posts.id FROM Comment C WHERE C.owner=:owner GROUP BY posts.id)"
			def results = Posts.executeQuery(query,[owner:user], [offset:params.offset, max:params.max])			
			def totalCount = Posts.executeQuery(query,[owner:user]).size()

			return [list: results.collect { Posts it -> toMyPostsMap(it)}, count:results?.size(), total: totalCount]
		}
		return null
	}

	private def toMyPostsMap(Posts it) {
		return [
			id : it.id,
			category : it.category.name(),
			categoryName : it.category.displayName,
			title : it.title,
			situations : it.situations,
			thoughts : it.thoughts,
			backgroundSeq : it.backgroundSeq,
			isSprout : it.isSprout,
			sproutedComment : it.sproutedComment,
			isSentThankYouNote : it.isSentThankYouNote,
			isPrivate : it.isPrivate

		]
	}
	
	def myCounselingCount() {
		def user = springSecurityService.currentUser
		return counselingCountByUser(user)
	}
	
	def counselingCountByUser(user) {
		if(user!=null) {
			def query = "FROM Posts A WHERE A.id in (SELECT C.posts.id FROM Comment C WHERE C.owner=:owner GROUP BY posts.id)"
			def postsCount = Posts.executeQuery(query,[owner:user]).size()
			def sproutCount = Sprout.countByOwnerAndIsRemoved(user, false)

			return [postsCount:postsCount, sproutCount:sproutCount]
		}
		return null
	}
	
	def countByUser(user) {
		if(user!=null) {
			def postsCount = Posts.countByOwnerAndIsRemoved(user, false)
			return [postsCount:postsCount]
		}
		return null
	}

	def item(seq) {
		Posts posts = Posts.get(seq)
		/*
		 * need
		 * 
		 * dateCreated : it.dateCreated,
		 lastUpdated : it.lastUpdated,
		 recommTotal:?
		 */

		def user = springSecurityService.currentUser
		return posts.collect{it ->
			def mood = Mood.findByPosts(it, [sort: "id", order: "desc"])	// 최근			
			println mood
			[
				id : it.id,
				latitude : it.latitude,
				longitude : it.longitude,
				category : it.category.name(),
				categoryName : it.category.displayName,
				title : it.title,
				situations : it.situations,
				thoughts : it.thoughts,
				backgroundSeq : it.backgroundSeq,
				dateCreated : it.dateCreated,
				lastUpdated : it.lastUpdated,
				aboutWriter : it.owner.getAbout(),
				isOwner : it.owner==user,
				commentTotal:Comment.countByPostsAndIsRemoved(it, false),
				recommTotal:it.recomms.size(),
				moodValue :(mood?mood.moodValue:0)
			]}
	}

	def create(jsonObject) {
		def user = springSecurityService.currentUser
		def posts = new Posts(jsonObject.posts)
		posts.owner = user
		if(!(posts.validate() && posts.save())) {
			posts.errors.allErrors.each { log.error it }
			throw new IllegalArgumentException(posts.errors.allErrors.join(" "))
		}

		if(posts.id > 0) {
			Mood mood = new Mood(jsonObject.mood)
			mood.owner = user
			mood.posts = posts
			if(!(mood.validate() && mood.save())) {
				mood.errors.allErrors.each { log.error it }
				throw new IllegalArgumentException(mood.errors.allErrors.join(" "))
			}
		}
		return true
	}

	def update(seq, jsonObject) {
		def user = springSecurityService.currentUser
		if(seq > 0) {
			Posts posts = Posts.find {
				(id == seq) && (owner == user)
			}
			if(posts) {
				if(jsonObject.posts) {
					posts.properties = jsonObject.posts
					if(!(posts.validate() && posts.save())) {
						posts.errors.allErrors.each { log.error it }
						throw new IllegalArgumentException(posts.errors.allErrors.join(" "))
					}
				}

				if(jsonObject.mood) {
					Mood mood = new Mood(jsonObject.mood)
					mood.owner = user
					mood.posts = posts
					mood.isFirst = false
					if(!(mood.validate() && mood.save())) {
						mood.errors.allErrors.each { log.error it }
						throw new IllegalArgumentException(mood.errors.allErrors.join(" "))
					}
				}
			}
		}
		return true
	}


	def remove(seq) {
		def currentUser = springSecurityService.currentUser
		if(seq > 0) {
			Posts posts = Posts.find {
				(id == seq)
			}
			if(posts) {
				if (currentUser.userDiv==UserDiv.ADMIN || posts.owner==currentUser) {
					posts.isRemoved = true
					if(!(posts.validate() && posts.save())) {
						posts.errors.allErrors.each { log.error it }
						throw new IllegalArgumentException(posts.errors.allErrors.join(" "))
					}
				} else {
					throw new SgspException(ResultCode.FAIL, "삭제 권한이 없습니다.");
				}
			} else {
				throw new SgspException(ResultCode.FAIL, "삭제중 오류가 발생하였습니다.");
			}
		}
		return true
	}

	def recomm(seq) {
		def user = springSecurityService.currentUser
		def posts = Posts.get(seq)

		def exist = Recomm.findWhere(owner:user, posts:posts)
		if(exist) {
			throw new SgspException(ResultCode.RECOMM_ALREADY, "이미 추천하였습니다.");
		}

		def recomm = new Recomm()
		recomm.owner = user
		recomm.posts = posts

		if(!(recomm.validate() && recomm.save())) {
			recomm.errors.allErrors.each { log.error it }
			throw new IllegalArgumentException(recomm.errors.allErrors.join(" "))
		}

		if(recomm.id > 0) {
			posts.addToRecomms(recomm)
			posts.save()
			return true
		}
	}

	def cancelRecomm(seq) {
		def user = springSecurityService.currentUser
		def posts = Posts.get(seq)
		if(posts) {
			def exist = Recomm.findWhere(owner:user, posts:posts)
			if(!exist) {
				throw new SgspException(ResultCode.NO_DATA, "추천된 댓글이 아닙니다.");
			} else {
				posts.removeFromRecomms(exist)
				exist.delete()
				return true
			}
		}
		return false
	}
	
	def oppose(seq) {
		def user = springSecurityService.currentUser
		def posts = Posts.get(seq)

		def exist = Oppose.findWhere(owner:user, posts:posts)
		if(exist) {
			throw new SgspException(ResultCode.OPPOSE_ALREADY, "이미 신고하였습니다.");
		}

		def oppose = new Oppose()
		oppose.owner = user
		oppose.posts = posts

		if(!(oppose.validate() && oppose.save())) {
			oppose.errors.allErrors.each { log.error it }
			throw new IllegalArgumentException(oppose.errors.allErrors.join(" "))
		}
		
		println oppose

		if(oppose.id > 0) {
			posts.addToOpposes(oppose)
			posts.save()
			return true
		}
		return false
	}
}
