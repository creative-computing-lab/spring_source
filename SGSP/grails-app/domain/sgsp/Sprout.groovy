package sgsp

import sgsp.data.FeedType
import sgsp.sec.User

// 새싹
class Sprout {
	// 관련 코멘트
	Comment comment
	// 새싹주기를 한 사용자
	User from
	// 삭제여부
	boolean isRemoved = false

	String memo

	// 새싹을 받은 상담자
	static belongsTo = [owner : User]

	static constraints = {
		comment nullable : true
		memo nullable : true
	}

	static mapping = { version false }
	
	
//	boolean isRemovedChanged = false

//	static transients = ['isRemovedChanged']

	// insert 후
	def afterInsert() {
		insertFeed()
	}

	// update 전
/*	def beforeUpdate() {
		isRemovedChanged = this.isDirty('isRemoved')

	}*/

	// update 후
/*	def afterUpdate() {
		if (isRemovedChanged && isRemoved) {
			insertCancelFeed()
		}
	}*/
	
	private void insertFeed() {
		def feed = new Feed()
		feed.type = FeedType.BUD
		feed.posts = comment.posts
		feed.owner = this.owner
		feed.shortContent = comment.shortContent
		feed.title = '내 댓글이 채택되었습니다'
		feed.save()
	}
	
/*	private void insertCancelFeed() {
		def feed = new Feed()
		feed.type = FeedType.CANCEL_BUD
		feed.posts = null
		feed.owner = this.owner
		feed.title = '댓글채택이 취소되었습니다'
		feed.save()
	}*/
}
