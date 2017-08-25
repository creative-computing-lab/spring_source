package sgsp.push

import grails.transaction.Transactional

import org.codehaus.groovy.grails.web.json.JSONObject

import sgsp.data.SendStatus

@Transactional
class PushSendBoxService {

	def springSecurityService

	def list(params) {
		params.max = Math.min(params.max ? params.int('max') : 10, 100)
		params.offset = params.offset?params.int('offset') :0
		params.sort = params.sort?params.sort:'id'
		params.order = params.order?params.order:'desc'


		def results = PushSend.createCriteria().list(max: params.max, offset: params.offset) {
			resultTransformer(org.hibernate.criterion.CriteriaSpecification.ALIAS_TO_ENTITY_MAP)

			projections  {
				property "id", "id"
				property "status", "status"
				property "shortContent", "body"
				property "failReason", "failReason"
				property "lastUpdated", "lastUpdated"
			}
			eq 'isRemoved', false
			order params.sort, params.order
		}

		return [list: results.collect {it->
				SendStatus status = it.get('status')
				it.put "status", status.name()
				it
			}, count:results?.size(), total: results?.getTotalCount()]
	}

	def item(seq) {
		if(seq > 0) {
			def result = PushSend.createCriteria().get{
				resultTransformer(org.hibernate.criterion.CriteriaSpecification.ALIAS_TO_ENTITY_MAP)
				projections  {
					property "id", "id"
					property "status", "status"
					property "toType", "toType"
					property "toIds", "toIds"
					property "datePrepare", "datePrepare"
					property "dateBegin", "dateBegin"
					property "dateSent", "dateSent"
					property "body", "body"
					property "failReason", "failReason"
					property "lastUpdated", "lastUpdated"
				}
				and {
					eq 'id', seq
					eq 'isRemoved', false
				}
			}
			
			result.put "status", toEnumMap(result.get('status'))
			result.put "toType", toEnumMap(result.get('toType'))

			SendStatus status = result.get('status')
			if(status == SendStatus.READY_TO_SEND) {
				result.put 'total', PushMessage.countBySend(PushSend.load(result.get('id')))
			} else if(status == SendStatus.SENDING || status == SendStatus.CANCEL_SENDING) {
				result.put 'total', PushMessage.countBySend(PushSend.load(result.get('id')))
				result.put 'sent', PushMessage.countBySendAndStatus(PushSend.load(result.get('id')), SendStatus.DONE)
			}
			
			return result
		}
		return null
	}
	
	private def toEnumMap(e) {
		e.name()
	}

	def create(jsonObject) {
		def user = springSecurityService.currentUser
		PushSend pushSend  = new PushSend(jsonObject)
		pushSend.owner = user
		// 예약 전송 기능이 있다면,
		// 이 부분에서 CREATED로 생성하고, 예약시간에 PREPARING으로 변경		
		pushSend.status = SendStatus.PREPARING
		if(!(pushSend.validate() && pushSend.save())) {
			pushSend.errors.allErrors.each { log.error it }
			throw new IllegalArgumentException(pushSend.errors.allErrors.join(" "))
		}
		return pushSend.id
	}

	def update(seq, JSONObject jsonObject) {
		if(seq > 0) {
			PushSend pushSend = PushSend.get (seq);
			if(pushSend) {
				if(jsonObject.get('body') != JSONObject.NULL) {
					pushSend.body = jsonObject.get('body');
				}
				//pushSend.properties = jsonObject
				if(!(pushSend.validate() && pushSend.save())) {
					pushSend.errors.allErrors.each { log.error it }
					throw new IllegalArgumentException(pushSend.errors.allErrors.join(" "))
				}
			}
		}
		return true
	}
	
	def updateToSend(seq) {
		if(seq > 0) {
			PushSend pushSend = PushSend.get (seq);
			if(pushSend) {
				pushSend.status = SendStatus.SENDING
				pushSend.dateBegin = new Date()
				//pushSend.properties = jsonObject
				if(!(pushSend.validate() && pushSend.save())) {
					pushSend.errors.allErrors.each { log.error it }
					throw new IllegalArgumentException(pushSend.errors.allErrors.join(" "))
				}
			}
		}
		return true
	}
	
	def updateToCancelSend(seq) {
		if(seq > 0) {
			PushSend pushSend = PushSend.get (seq);
			if(pushSend) {
				pushSend.status = SendStatus.CANCEL_SENDING
				if(!(pushSend.validate() && pushSend.save())) {
					pushSend.errors.allErrors.each { log.error it }
					throw new IllegalArgumentException(pushSend.errors.allErrors.join(" "))
				}
			}
		}
		return true
	}
	
	def remove(seq) {
		if(seq > 0) {
			PushSend pushSend = PushSend.get (seq);
			if(pushSend) {
				pushSend.isRemoved = true
				if(!(pushSend.validate() &&pushSend.save())) {
					pushSend.errors.allErrors.each { log.error it }
					throw new IllegalArgumentException(pushSend.errors.allErrors.join(" "))
				}
			}
		}
		return true
	}
}
