package sgsp

import grails.test.mixin.Mock
import grails.test.mixin.TestFor

import java.awt.print.Book

import org.slf4j.Logger
import org.slf4j.LoggerFactory

import sgsp.data.PostsCategory
import sgsp.data.UserDiv
import sgsp.sec.User
import sgsp.sec.UserRole
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.services.ServiceUnitTestMixin} for usage instructions
 */
@TestFor(PostsService)
class PostsServiceSpec extends Specification {

	Logger log = LoggerFactory.getLogger(PostsServiceSpec)
	
	
    def setup() {
		// test
/*		User test = new User()
		test.username = "test"
		test.password = "1234"
		test.userDiv = UserDiv.NORMAL
		test.birthday="1994-03-10"
		test.gender="M"

		if(User.findByUsername(test.username)==null) {
			test.save(failOnError: true)
			UserRole.create test, userRole, true
		}
		
		// posts
		if(Posts.count() == 0) {
			Posts posts = new Posts()
			posts.owner = test
			posts.latitude = 37.566
			posts.longitude = 126.977
			
			posts.category = PostsCategory.STUDY
			posts.title = "제목"
			posts.situations = "상황글"
			
			posts.thoughts = "생각글"
			posts.backgroundSeq = "1"
			posts.isPrivate = false
			
			posts.save(failOnError: true)
			
			Mood mood = new Mood()
			mood.owner = test
			mood.posts = posts
			mood.moodValue = 500
			mood.isFirst = true
			
			mood.save(failOnError: true)
		}*/
		
		
    }

    def cleanup() {
    }

    void "test list"() {
		given :
		final params = [:]
		PostsService service = new PostsService()
		
		when : 
		def result = service.list(params)
		
		then :
		log.debug result
		result != null
    }
}
