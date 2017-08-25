package sgsp

import java.util.Date;

import sgsp.sec.User

// 부적절, 비추
class Oppose {
	Date dateCreated
	Date lastUpdated

	static belongsTo = [owner : User, posts : Posts]

	static constraints = { posts unique : ['owner']}

	static mapping = { version false }
}
