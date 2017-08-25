package sgsp.marshalling

import grails.converters.JSON

import java.awt.print.Book

import sgsp.Comment
import sgsp.Posts
import sgsp.sec.User

class PostsMarshaller {
	void register() {
		JSON.registerObjectMarshaller(Posts) { Posts it ->
			return [
				id : it.id,
				latitude : it.latitude,
				longitude : it.longitude,
				category : it.category.name(),
				title : it.title,
				situations : it.situations,
				thoughts : it.thoughts,
				backgroundSeq : it.backgroundSeq,
				aboutWriter : getAbout(it.owner),
				owner : it.owner.getUsername(),
				commentTotal:Comment.countByPostsAndIsRemoved(Posts.load(it.id), false),
				distance : it.distance
			]
		}
	}

	// 대략 정보 (20대 여성)
	private def getAbout(User user) {
		def returnAge = "";
		int age = user.getAge()/10
		
		if (age < 1) {
			returnAge ="10대 이하"
		} else {
			returnAge = age + "0대";
		}
		
		def gender = user.gender == "M" ? "남성" : (user.gender == "F" ? "여성":"")
		
		"${returnAge} ${gender}"
	}
}
