package sgsp

import grails.transaction.Transactional

import java.text.SimpleDateFormat

import org.apache.commons.collections.map.LinkedMap
import org.hibernate.criterion.CriteriaSpecification

import sgsp.sec.User

@Transactional
class MoodService {

	def springSecurityService

	def mylist(params) {
		def user = springSecurityService.currentUser

		if(user!=null) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd")
			return Mood.findAllByOwner(user).collect{ Mood it ->
				[
					id : it.id,
					moodValue : it.moodValue,
					isFirst : it.isFirst,
					lastUpdated : it.lastUpdated,
					lastUpdatedDate : sdf.format(it.lastUpdated)
				]
			}
		}
		return null
	}


	def list(params) {

		params.max = Math.min(params.max ? params.int('max') : 10, 100)
		params.offset = params.offset?params.int('offset') :0
		params.sort = params.sort?params.sort:'lastUpdated'
		params.order = params.order?params.order:'desc'

		def results = Mood.createCriteria().list(max: params.max, offset: params.offset) {
			resultTransformer(org.hibernate.criterion.CriteriaSpecification.ALIAS_TO_ENTITY_MAP)
			createAlias "owner", "owner"
			createAlias "posts", "posts"
			// icay, 20170503, 댓글채택(새싹)으로 생성된 mood값에는 comment가 들어있음
			// comment값을 nullable이기 때문에 LEFT_JOIN으로 해야
			// => comment가 없는 mood도 조회됨
			createAlias "comment", "comment", CriteriaSpecification.LEFT_JOIN			
			createAlias "comment.owner", "commentOwner", CriteriaSpecification.LEFT_JOIN
			projections  {
				property "id", "id"
				property "moodValue", "moodValue"
				property "lastUpdated", "lastUpdated"
				property "posts.title", "postsTitle"
				property "owner.username", "ownerName"
				property "comment.shortContent", "commentBody"
				property "commentOwner.username", "counselorName"
			}

			if(params.ownerName) {
				and { eq 'owner', User.findByUsername(params.ownerName) }
			}
			order params.sort, params.order
		}
		return [list: results.collect{
			LinkedMap<String, Object> temp = new LinkedMap<String, Object>()
			temp.put "id", it.id
			temp.put "moodValue", it.moodValue
			temp.put "lastUpdated", it.lastUpdated
			temp.put "postsTitle", it.postsTitle
			temp.put "ownerName", it.ownerName
			temp.put "commentBody", it.commentBody?:""
			temp.put "counselorName", it.counselorName?:""
			temp
		}, count:results?.size(), total: results?.getTotalCount()]
	}
}
