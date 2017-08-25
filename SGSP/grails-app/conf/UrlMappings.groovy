import sgsp.data.FeedType

class UrlMappings {

	static mappings = {
		"/posts/$postsSeq/comment/list"{
			controller = "comment"
			action = "list"
			constraints {
				postsSeq validator: {it.isNumber() }
			}
		}

		"/posts/$postsSeq/comment/create"{
			controller = "comment"
			action = "create"
			constraints {
				postsSeq validator: {it.isNumber() }
			}
		}

		"/posts/$postsSeq/recomm"{
			controller = "posts"
			action = "recomm"
			constraints {
				postsSeq validator: {it.isNumber() }
			}
		}

		"/posts/$postsSeq/cancelRecomm" {
			controller = "posts"
			action = "cancelRecomm"
			constraints {
				postsSeq validator: {it.isNumber() }
			}
		}
		
		"/posts/$postsSeq/oppose"{
			controller = "posts"
			action = "oppose"
			constraints {
				postsSeq validator: {it.isNumber() }
			}
		}

		"/comment/$commentSeq/thankNote/create" {
			controller = "thankYouNote"
			action = "create"
			constraints {
				commentSeq validator: {it.isNumber() }
			}
		}
		
		"/comment/$seq/recomm" {
			controller = "comment"
			action = "recomm"
			constraints {
				seq validator: {it.isNumber() }
			}
		}
		
		"/comment/$seq/cancelRecomm" {
			controller = "comment"
			action = "cancelRecomm"
			constraints {
				seq validator: {it.isNumber() }
			}
		}

		"/news/$action"{
			controller = "feed"
			type = [
				FeedType.RECOMM,
				FeedType.COMMENT
			]
		}

		"/$controller/$seq"{
			action = "item"
			constraints {
				seq validator: {it.isNumber() }
			}
		}


		"/$controller/$action?/$seq?(.$format)?"{
			constraints {
				seq validator: {it.isNumber() }
			}
		}

		"/"(view:'index')

		"500"(view:'/error')
	}
}
