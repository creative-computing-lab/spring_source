package sgsp

import sgsp.sec.User

class CommentRecomm {

	Date dateCreated
	Date lastUpdated

	static belongsTo = [owner : User, comment : Comment]

	static constraints = { comment unique : ['owner']}

	static mapping = { version false }
}
