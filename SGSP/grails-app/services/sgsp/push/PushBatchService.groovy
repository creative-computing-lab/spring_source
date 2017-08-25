package sgsp.push

import grails.transaction.Transactional
import sgsp.Feed
import sgsp.data.SendStatus
import sgsp.data.SendToType
import sgsp.data.UserDiv

@Transactional
class PushBatchService {

	def prepareMessage() {
		// 생성된 1건을 읽어온다.
		PushSend result = PushSend.createCriteria().get{
			and {
				eq 'status', SendStatus.PREPARING
				eq 'isRemoved', false
			}
			maxResults 1
		}

		if(result) {

			println "prepareMessage... ${result}"

			// 보낼 사용자를 얻어옴
			List<PushTarget> targetList = getPushTargetList(result)

			// 있다면,
			if(targetList && targetList.size() > 0) {

				// target => message로 저장
				createPushMessage(result, targetList)

				// send의 상태을 전이
				result.status = SendStatus.READY_TO_SEND
				result.datePrepare = new Date()
				result.save()
			}

			// 없으면 -> DONE
			else {
				result.status = SendStatus.DONE
				result.failReason = "보낼 대상이 없습니다."
				result.save()
			}
		}
	}

	private List<PushTarget> getPushTargetList(PushSend pushSend) {
		def results = null

		results = PushTarget.createCriteria().list() {
			createAlias('owner', 'owner')
			and {
				isNotNull 'owner'
				eq 'owner.enabled', true
				isNotNull 'token'
				eq 'isAgreeSend', true
				eq 'isExpire', false
				// 일반사용자를 대상으로
				if(pushSend.toType == SendToType.TO_NORMAL) {
					eq 'owner.userDiv', UserDiv.NORMAL
				}
				// 상담자일때
				else if(pushSend.toType == SendToType.TO_COUNSELOR) {
					eq 'owner.userDiv', UserDiv.COUNSELOR
				}
				// 지정 사용자에게
				else if(pushSend.toType == SendToType.TO_ETC && pushSend.toIds) {
					List<Long> ids = []
					def toIds = pushSend.toIds.split(';')
					for(def toId : toIds) {
						ids.add(Long.parseLong(toId))
					}
					'in' 'owner.id', ids
				}
			}
		}

		results
	}

	private def createPushMessage(PushSend send, List<PushTarget> targetList) {
		targetList.each {PushTarget target->
			PushMessage message = new PushMessage('token' : target.token, 'to':target.owner, 'send':send)
			save(message)
			send.addToMessages(message)
		}
		send.save()
	}

	private save(obj) {
		if(!(obj.validate() && obj.save())) {
			obj.errors.allErrors.each { log.error it }
			throw new IllegalArgumentException(obj.errors.allErrors.join(" "))
		}
	}

	/// feed

	def prepareFeed() {
		// 생성된 1건을 읽어온다.
		Feed result = Feed.createCriteria().get{
			and { eq 'status', SendStatus.PREPARING }
			maxResults 1
		}
		if(result) {
			println "prepareFeed... ${result}"
			// 보낼 사용자를 얻어옴
			PushTarget target = getPushTarget(result)

			// 있다면,
			if(target) {

				// target => message로 저장
				createPushMessage(result, target)

				// send의 상태을 전이
				result.status = SendStatus.SENDING
				result.dateBegin = new Date()
				result.save()
			}

			// 없으면 -> DONE
			else {
				result.status = SendStatus.DONE
				result.failReason = "보낼 대상이 없습니다."
				result.save()
			}
		}
	}

	private PushTarget getPushTarget(Feed feed) {
		def results = null
		// 전체 대상
		results = PushTarget.createCriteria().get() {
			createAlias('owner', 'owner')
			and {
				eq 'owner', feed.owner

				eq 'owner.enabled', true
				isNotNull 'token'
				eq 'isAgreeSend', true
				eq 'isExpire', false
			}
		}
		results
	}

	private def createPushMessage(Feed feed, PushTarget target) {
		PushMessage message = new PushMessage('token' : target.token, 'to':target.owner, 'feed':feed)
		save(message)
	}
}
