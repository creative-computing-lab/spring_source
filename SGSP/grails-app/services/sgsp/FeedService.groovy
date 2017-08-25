package sgsp

import grails.transaction.Transactional

@Transactional
class FeedService {

	def springSecurityService

	def mylist(params) {
		params.max = Math.min(params.max ? params.int('max') : 10, 100)
		params.offset = params.offset?params.int('offset') :0
		params.sort = params.sort?params.sort:'id'
		params.order = params.order?params.order:'desc'

		def user = springSecurityService.currentUser
		def results = Feed.createCriteria().list(max: params.max, offset: params.offset) {
			and {
				eq 'owner', user
				if(params.type) {
					'in' 'type', params.type
				}
			}
			order params.sort, params.order
		}

		return [list: results.collect { Feed it ->
				[
					id : it.id,
					type : it.type.name(),
					isRead : it.isRead,
					postsId : it.postsId,
					title : it.title,
					body : it.shortContent,
					dateCreated : it.dateCreated,
					lastUpdated : it.lastUpdated
				]
			}, count:results?.size(), total: results?.getTotalCount()]
	}

	def markAsRead(seq) {
		def currentUser = springSecurityService.currentUser
		if(seq > 0) {
			Feed feed = Feed.find {
				(id == seq) && (owner == currentUser)
			}
			if(feed) {
				feed.isRead = true
				if(!(feed.validate() && feed.save())) {
					feed.errors.allErrors.each { log.error it }
					throw new IllegalArgumentException(feed.errors.allErrors.join(" "))
				}
			}
		}
		return true
	}
}
