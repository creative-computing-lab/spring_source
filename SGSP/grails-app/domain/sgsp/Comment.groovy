package sgsp

import sgsp.data.FeedType
import sgsp.sec.User

// 댓글
class Comment {
	String shortContent
	// 내용
	String body
	// 새싹
	boolean isSprout = false

	boolean isRemoved = false

	Date dateCreated
	Date lastUpdated

	static belongsTo = [owner : User, posts : Posts]

	static hasMany = [recomms:CommentRecomm]
	
	static constraints = { shortContent nullable : true }

	def springSecurityService
	
	static mapping = {
		shortContent length: 200
		body type : 'text'
		version false
	}

	// insert 전
	def beforeInsert() {
		copyContent()
	}

	// insert 후
	def afterInsert() {
		def currentUser = springSecurityService.currentUser
		if ( this.posts.owner == currentUser ) {
			// Not feed
		} else {
			insertFeed()
		}
	}

	// update 전
	def beforeUpdate() {
		if(this.isDirty('body')) {
			copyContent()
		}
	}

	private void copyContent() {
		if(body.length() > 50) {
			shortContent = "${body.substring(0, 50)}..."
		}
		shortContent = body
	}

	private void insertFeed() {
		def feed = new Feed()
		feed.type = FeedType.COMMENT
		feed.posts = this.posts
		feed.owner = this.posts.owner
		feed.title = this.owner.username + ' 로부터 댓글이 작성되었습니다.'
		feed.save()
	}
}
