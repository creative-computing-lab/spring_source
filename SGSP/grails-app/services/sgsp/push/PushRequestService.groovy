package sgsp.push

import grails.transaction.Transactional
import sgsp.Feed
import sgsp.common.SgspException
import sgsp.data.SendStatus
import sgsp.data.PushMessageType

@Transactional
class PushRequestService {

	def grailsApplication

	def fcmSender

	def sendMessage() {
		// 보낼 1건을 읽어온다.
		PushSend send = PushSend.createCriteria().get{
			and {
				eq 'status', SendStatus.SENDING
				eq 'isRemoved', false
			}
			maxResults 1
		}

		if(send) {
			println "sendMessage... ${send}"

			try {
				def max = grailsApplication.config.fcm.message.max
				List<PushMessage> messages = nextToken(send, max)

				if(messages && messages.size() > 0) {
					def result = fcmSender.sendToFcm(send, messages)
					if(result) {
						messages.each { PushMessage message ->
							message.status = SendStatus.DONE
							message.dateSent = new Date()
							message.save()
						}
					}
				} else {
					send.status = SendStatus.DONE
					send.dateSent = new Date()
					send.save()
				}

			} catch(SgspException e) {
				log.error(e.toString())
				send.status = SendStatus.DONE
				send.dateSent = new Date()
				send.failReason = e.message
				send.save()
			}
		}
	}

	private def nextToken(PushSend send, max) {
		def results = PushMessage.createCriteria().list(max: max, offset: 0) {
			and {
				eq 'send', send
				ne 'status', SendStatus.DONE
			}
			order 'id', 'asc'
		}
	}

	//////////
	// feed

	def sendFeed() {
		// 보낼 1건을 읽어온다.
		Feed feed = Feed.createCriteria().get{
			and { eq 'status', SendStatus.SENDING }
		}

		if(feed) {
			println "sendFeed... ${feed}"
			try {				
				PushMessage message = PushMessage.createCriteria().get() {
					and {
						eq 'feed', feed
						ne 'status', SendStatus.DONE
					}
				}
				if(message) {
					def result = fcmSender.requestToFcm(message.token, PushMessageType.TEXT, feed.title, feed.shortContent, '')
					if(result) {
						message.status = SendStatus.DONE
						message.dateSent = new Date()
						message.save()
					}
				} else {
					feed.status = SendStatus.DONE
					feed.dateSent = new Date()
					feed.save()
				}

			} catch(SgspException e) {
				log.error(e.toString())
				feed.status = SendStatus.DONE
				feed.dateSent = new Date()
				feed.failReason = e.message
				feed.save()
			}
		}
	}

}

