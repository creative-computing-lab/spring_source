import sgsp.Comment
import sgsp.Mood
import sgsp.Oppose
import sgsp.Posts
import sgsp.RecommCode
import sgsp.data.Career
import sgsp.data.Degree
import sgsp.data.PostsCategory
import sgsp.data.UserDiv
import sgsp.sec.Role
import sgsp.sec.User
import sgsp.sec.UserRole

class BootStrap {

	def init = { servletContext ->

		// JSON Marshallers
		//new CustomObjectMarshallers().register()

		// account
		def adminRole = Role.findByAuthority('ROLE_ADMIN') ?: new Role(authority: 'ROLE_ADMIN').save()
		def userRole = Role.findByAuthority('ROLE_USER') ?: new Role(authority: 'ROLE_USER').save()
		def counselorRole = Role.findByAuthority('ROLE_COUNSELOR') ?: new Role(authority: 'ROLE_COUNSELOR').save()

		environments {
			development {
				// admin
				User admin = new User()
				admin.username = "admin"
				admin.password = "1234"
				admin.userDiv = UserDiv.ADMIN
				admin.birthday="1988-02-01"
				admin.gender=""

				if(User.findByUsername(admin.username)==null) {
					admin.save()
					UserRole.create admin, adminRole, true
					UserRole.create admin, userRole, true
				}

				// test
				User test = new User()
				test.username = "test"
				test.password = "1234"
				test.userDiv = UserDiv.NORMAL
				test.birthday="1994-03-10"
				test.gender="M"

				if(User.findByUsername(test.username)==null) {
					test.save()
					UserRole.create test, userRole, true
				}

				// test
				User test2 = new User()
				test2.username = "test2"
				test2.password = "1234"
				test2.userDiv = UserDiv.NORMAL
				test2.birthday="1994-03-10"
				test2.gender="F"

				if(User.findByUsername(test2.username)==null) {
					test2.save()
					UserRole.create test2, userRole, true
				}

				// cslr
				User cslr = new User()
				cslr.username = "cslr"
				cslr.password = "1234"
				cslr.userDiv = UserDiv.COUNSELOR
				cslr.birthday="1997-09-23"
				cslr.gender="M"

				cslr.career=Career.LESS_THEN_1_YEAR
				cslr.degree=Degree.DOCTERS_COURSE

				if(User.findByUsername(cslr.username)==null) {
					cslr.save()
					UserRole.create cslr, counselorRole, true
				}
				
				// test
				User test3 = new User()
				test3.username = "test3"
				test3.password = "1234"
				test3.userDiv = UserDiv.NORMAL
				test3.birthday="1994-04-10"
				test3.gender="F"

				if(User.findByUsername(test3.username)==null) {
					test3.save()
					UserRole.create test3, userRole, true
				}

				// posts
				if(Posts.count() == 0) {
					Posts posts = new Posts()
					posts.owner = test
					posts.latitude = 37.566
					posts.longitude = 126.977

					posts.category = PostsCategory.STUDY
					posts.title = "서운하고 창피해서 슬퍼요"
					posts.situations = "친구랑 전화를 하다가 속상한 일에 대해서 이야기하고 있었는데 갑자기 아빠가 부르신다고 하면서"

					posts.thoughts = "진짜 걱정하는 거면 심부름 해 드리고나서 카톡이라도 보내서 괜찮냐고 물어봐야 하는 거 아냐?"
					posts.backgroundSeq = "1"
					posts.isPrivate = false

					posts.save()

					Mood mood = new Mood()
					mood.owner = test
					mood.posts = posts
					mood.moodValue = 50
					mood.isFirst = true

					mood.save()
					// comment
					if(Comment.count() == 0) {
						Comment comment = new Comment()
						comment.owner = test
						comment.posts = posts
						comment.body = "너무 서운해 하지 마세요. 카톡도 너무 신경쓰면 안 좋아요~"

						comment.save()

						posts.addToComments(comment)
						posts.save()
					}
					
					Posts posts2 = new Posts()
					posts2.owner = test
					posts2.latitude = 37.566
					posts2.longitude = 126.977

					posts2.category = PostsCategory.STUDY
					posts2.title = "서운하고 창피해서 슬퍼요2"
					posts2.situations = "친구랑 전화를 하다가 속상한 일에 대해서 이야기하고 있었는데 갑자기 아빠가 부르신다고 하면서"

					posts2.thoughts = "진짜 걱정하는 거면 심부름 해 드리고나서 카톡이라도 보내서 괜찮냐고 물어봐야 하는 거 아냐?"
					posts2.backgroundSeq = "1"
					posts2.isPrivate = false

					posts2.save()

					Mood mood2 = new Mood()
					mood2.owner = test
					mood2.posts = posts2
					mood2.moodValue = 50
					mood2.isFirst = true

					mood.save()
					
					// Oppose
					def oppose = new Oppose()
					oppose.owner = test3
					oppose.posts = posts
					oppose.save()
					
					/*def oppose4 = new Oppose()
					oppose4.owner = test3
					oppose4.posts = posts2
					oppose4.save()*/
					
					def oppose2 = new Oppose()
					oppose2.owner = test2
					oppose2.posts = posts2
					oppose2.save()

				}
				
				// recomm code
				RecommCode code = new RecommCode()
				code.code = 'test'
				code.description = 'test'
				code.owner = admin
				code.save()
				
				
			}
			
			production {
				// admin
				User admin = new User()
				admin.username = "admin"
				admin.password = "1234"
				admin.userDiv = UserDiv.ADMIN
				admin.birthday="1988-02-01"
				admin.gender=""

				if(User.findByUsername(admin.username)==null) {
					admin.save()
					UserRole.create admin, adminRole, true
					UserRole.create admin, userRole, true
				}

				// test
				User test = new User()
				test.username = "test"
				test.password = "1234"
				test.userDiv = UserDiv.NORMAL
				test.birthday="1994-03-10"
				test.gender="M"

				if(User.findByUsername(test.username)==null) {
					test.save()
					UserRole.create test, userRole, true
				}

				// cslr
				User cslr = new User()
				cslr.username = "cslr"
				cslr.password = "1234"
				cslr.userDiv = UserDiv.COUNSELOR
				cslr.birthday="1997-09-23"
				cslr.gender="M"

				cslr.career=Career.LESS_THEN_1_YEAR
				cslr.degree=Degree.DOCTERS_COURSE

				if(User.findByUsername(cslr.username)==null) {
					cslr.save()
					UserRole.create cslr, counselorRole, true
				}

				// posts
				/*
				if(Posts.count() == 0) {
					Posts posts = new Posts()
					posts.owner = test
					posts.latitude = 37.566
					posts.longitude = 126.977

					posts.category = PostsCategory.STUDY
					posts.title = "서운하고 창피해서 슬퍼요"
					posts.situations = "친구랑 전화를 하다가 속상한 일에 대해서 이야기하고 있었는데 갑자기 아빠가 부르신다고 하면서"

					posts.thoughts = "진짜 걱정하는 거면 심부름 해 드리고나서 카톡이라도 보내서 괜찮냐고 물어봐야 하는 거 아냐?"
					posts.backgroundSeq = "1"
					posts.isPrivate = false

					posts.save()

					Mood mood = new Mood()
					mood.owner = test
					mood.posts = posts
					mood.moodValue = 50
					mood.isFirst = true

					mood.save()
					// comment
					if(Comment.count() == 0) {
						Comment comment = new Comment()
						comment.owner = test
						comment.posts = posts
						comment.body = "너무 서운해 하지 마세요. 카톡도 너무 신경쓰면 안 좋아요~"

						comment.save()

						posts.addToComments(comment)
						posts.save()
					}
				}
				*/
				
				// recomm code
				RecommCode code = new RecommCode()
				code.code = 'test'
				code.description = 'test'
				code.owner = admin
				
				if(RecommCode.findByCode(code.code)==null) {
					code.save()
				}
			}
		}
	}
	def destroy = {
	}
}
