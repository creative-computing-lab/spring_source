package sgsp

import grails.transaction.Transactional

import org.codehaus.groovy.grails.web.json.JSONObject

@Transactional
class RecommCodeService {

	def springSecurityService

	def list(params) {
		params.max = Math.min(params.max ? params.int('max') : 10, 100)
		params.offset = params.offset?params.int('offset') :0
		params.sort = params.sort?params.sort:'id'
		params.order = params.order?params.order:'desc'

		def user = springSecurityService.currentUser
		def results = RecommCode.createCriteria().list(max: params.max, offset: params.offset) {
			and {  eq 'isRemoved', false				 }
			order params.sort, params.order
		}

		return [list: results.collect {RecommCode recommCode ->
				[
					'id':recommCode.id,
					'code':recommCode.code,
					'description':recommCode.description,
					'isUsed' : recommCode.isUsed,
					'dateExpire':recommCode.dateExpire,
					'lastUpdated':recommCode.lastUpdated
				]
			}, count:results?.size(), total: results?.getTotalCount()]
	}

	def item(seq) {
		if(seq > 0) {
			RecommCode recommCode = RecommCode.createCriteria().get{
				and {
					eq 'id', seq
					eq 'isRemoved', false
				}
			}

			return [
				'id':recommCode.id,
				'code':recommCode.code,
				'description':recommCode.description,
				'isUsed' : recommCode.isUsed,
				'dateExpire':recommCode.dateExpire,
				'lastUpdated':recommCode.lastUpdated
			]
		}
		return null
	}

	def create(jsonObject) {
		def user = springSecurityService.currentUser
		RecommCode recommCode  = new RecommCode(jsonObject)
		recommCode.owner = user
		if(!(recommCode.validate() && recommCode.save())) {
			recommCode.errors.allErrors.each { log.error it }
			throw new IllegalArgumentException(recommCode.errors.allErrors.join(" "))
		}
		return true
	}

	def update(seq, JSONObject jsonObject) {
		if(seq > 0) {
			RecommCode recommCode = RecommCode.get (seq);
			if(recommCode) {
				if(jsonObject.get('description') != JSONObject.NULL) {
					recommCode.desc = jsonObject.get('description');
				}
				if(jsonObject.get('isUsed') != JSONObject.NULL) {
					recommCode.isUsed = jsonObject.get('isUsed');
				}
				if(jsonObject.get('dateExpire') != JSONObject.NULL) {
					recommCode.dateExpire = jsonObject.get('dateExpire');
				}
				//recommCode.properties = jsonObject
				if(!(recommCode.validate() && recommCode.save())) {
					recommCode.errors.allErrors.each { log.error it }
					throw new IllegalArgumentException(recommCode.errors.allErrors.join(" "))
				}
			}
		}
		return true
	}

	def remove(seq) {
		if(seq > 0) {
			RecommCode recommCode = RecommCode.get (seq);
			if(recommCode) {
				recommCode.isRemoved = true
				if(!(recommCode.validate() &&recommCode.save())) {
					recommCode.errors.allErrors.each { log.error it }
					throw new IllegalArgumentException(recommCode.errors.allErrors.join(" "))
				}
			}
		}
		return true
	}

	def isAvailable(JSONObject jsonObject) {
		if(jsonObject.get('code') != JSONObject.NULL) {
			def count = RecommCode.createCriteria().get{
				projections { count('id') }
				eq 'code', jsonObject.code
				eq 'isUsed', true
				eq 'isRemoved', false
				or {
					isNull 'dateExpire'
					le 'dateExpire', new Date()
				}
			}
			return count > 0
		}
		return false
	}
}
