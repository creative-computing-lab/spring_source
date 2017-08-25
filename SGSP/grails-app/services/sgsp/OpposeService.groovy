package sgsp

import grails.transaction.Transactional

@Transactional
class OpposeService {

	def postsService

	def list(params) {
		params.max = Math.min(params.max ? params.int('max') : 10, 100)
		params.offset = params.offset?params.int('offset') :0
		params.sort = params.sort?params.sort:'id'
		params.order = params.order?params.order:'desc'

		def results = Posts.createCriteria().list(max: params.max, offset: params.offset) {
			resultTransformer(org.hibernate.criterion.CriteriaSpecification.ALIAS_TO_ENTITY_MAP)
			createAlias "owner", "owner"

			projections  {
				property "id", "postsId"
				property "title", "postsTitle"
				property "owner.username", "ownerName"
			}
			and {
				eq 'isPrivate', false
				eq 'isRemoved', false
				sizeGt("opposes", 0)
			}
			order params.sort, params.order
		}
		return [list: results.collect{it->
				it.put("opposeTotal", Oppose.countByPosts(Posts.load(it.postsId)))
				it
			}
			, count:results?.size(), total: results?.getTotalCount()]
	}
}