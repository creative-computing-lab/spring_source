package sgsp

import sgsp.data.FeedType
import sgsp.sec.User

// 하트, 추천
class Recomm {

	Date dateCreated
	Date lastUpdated

	static belongsTo = [owner : User, posts : Posts]

	static constraints = { posts unique : ['owner']}

	static mapping = { version false }
	
	def springSecurityService
	
	def afterInsert() {
		def currentUser = springSecurityService.currentUser
		if ( this.posts.owner == currentUser ) {
			// Not feed
		} else {
			def feed = new Feed();
			feed.type = FeedType.RECOMM
			feed.posts = this.posts
			feed.owner = this.posts.owner
			feed.title = this.owner.username + ' 에게 공감을 받았습니다'
			feed.save()
		}
	}
}
