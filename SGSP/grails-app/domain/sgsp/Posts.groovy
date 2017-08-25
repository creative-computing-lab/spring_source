package sgsp

import sgsp.data.PostsCategory
import sgsp.sec.User

// 글
class Posts {

	// GPS
	double latitude = 0
	double longitude = 0

	// 카테고리
	PostsCategory category = PostsCategory.ETC
	// 제목
	String title
	// 상황글
	String situations
	// 생각글
	String thoughts

	// 배경순번
	String backgroundSeq
	// 공개,비공개
	boolean isPrivate = false
	// 새싹여부
	boolean isSprout = false

	Comment sproutedComment

	// 탱큐노트 여부
	boolean isSentThankYouNote = false

	boolean isRemoved = false

	Date dateCreated
	Date lastUpdated

	static hasMany = [comments:Comment, recomms:Recomm, opposes:Oppose]

	// 사용자
	static belongsTo = [owner : User]

	static constraints = {
		backgroundSeq nullable : true
		sproutedComment nullable : true
	}

	static mapping = {
		backgroundSeq length: 64
		title length: 200
		situations type : 'text'
		thoughts type : 'text'
		version false
	}
}
