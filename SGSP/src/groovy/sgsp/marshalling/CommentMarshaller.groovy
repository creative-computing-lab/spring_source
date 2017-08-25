package sgsp.marshalling

import grails.converters.JSON
import sgsp.Comment
import sgsp.sec.User

class CommentMarshaller {
	void register() {
		JSON.registerObjectMarshaller(Comment) { Comment it ->
			return [
				id : it.id,
				writer : it.owner.username,
				body : it.body,
				isSprout : it.isSprout,
				lastUpdated : it.lastUpdated,
				dateCreated : it.dateCreated
			]
		}
	}
}
