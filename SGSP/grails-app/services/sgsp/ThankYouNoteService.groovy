package sgsp

import grails.transaction.Transactional

@Transactional
class ThankYouNoteService {

	def springSecurityService

	def mylist(params) {
		def user = springSecurityService.currentUser
		if(user!=null) {

			params.max = Math.min(params.max ? params.int('max') : 10, 100)
			params.offset = params.offset?params.int('offset') :0
			params.sort = params.sort?params.sort:'id'
			params.order = params.order?params.order:'desc'

			def results = ThankYouNote.createCriteria().list(max: params.max, offset: params.offset) {
				and { eq 'owner', user }
				order params.sort, params.order
			}

			return [list: results.collect { ThankYouNote it ->
					[
						'id' : it.id,
						'isRead' : it.isRead,
						'body' : it.shortContent,
						'dateCreated' : it.dateCreated

					]
				}, count:results?.size(), total: results?.getTotalCount()]
		}
		return null
	}

	def myRecvlist(params) {
		def user = springSecurityService.currentUser
		if(user!=null) {

			params.max = Math.min(params.max ? params.int('max') : 10, 100)
			params.offset = params.offset?params.int('offset') :0
			params.sort = params.sort?params.sort:'id'
			params.order = params.order?params.order:'desc'

			def results = ThankYouNote.createCriteria().list(max: params.max, offset: params.offset) {
				and { eq 'to', user }
				order params.sort, params.order
			}

			return [list: results.collect { ThankYouNote it ->
					[
						'id' : it.id,
						'isRead' : it.isRead,
						'body' : it.shortContent,
						'dateCreated' : it.dateCreated

					]
				}, count:results?.size(), total: results?.getTotalCount()]
		}
		return null
	}
	
	def item(seq) {
		if(seq > 0) {
			def user = springSecurityService.currentUser
			
			ThankYouNote thankYouNote = ThankYouNote.createCriteria().get{
				and {
					eq 'id', seq
					or {
						eq 'to', user
						eq 'owner', user
					}
				}
			}

			return [
				'id':thankYouNote.id,
				'isRead' : thankYouNote.isRead,
				'body':thankYouNote.body,
				'postsId':thankYouNote.postsId
			]
		}
		return null
	}

	def create(commentSeq, jsonObject) {

		def user = springSecurityService.currentUser

		Comment comment = Comment.get(commentSeq)

		def note = new ThankYouNote(jsonObject)

		note.comment = comment
		note.to = comment.owner
		note.posts = comment.posts
		note.owner = user

		if(!(note.validate() && note.save())) {
			note.errors.allErrors.each { log.error it }
			throw new IllegalArgumentException(note.errors.allErrors.join(" "))
		}
		
		if(note.id > 0) {
			Posts posts = comment.posts
			if(posts) {
				posts.isSentThankYouNote = true
				posts.save()
			}
		}

		return true
	}

	def markAsRead(seq) {
		def currentUser = springSecurityService.currentUser
		if(seq > 0) {
			ThankYouNote thankYouNote = ThankYouNote.find {
				(id == seq) && (to == currentUser)
			}
			if(thankYouNote) {
				thankYouNote.isRead = true
				if(!(thankYouNote.validate() && thankYouNote.save())) {
					thankYouNote.errors.allErrors.each { log.error it }
					throw new IllegalArgumentException(thankYouNote.errors.allErrors.join(" "))
				}
			}
		}
		return true
	}
}
