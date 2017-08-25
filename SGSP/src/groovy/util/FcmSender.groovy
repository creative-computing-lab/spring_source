package util

import grails.converters.JSON
import sgsp.common.SgspException
import sgsp.push.PushMessage
import sgsp.push.PushSend
import sgsp.data.PushMessageType

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.google.api.client.http.GenericUrl
import com.google.api.client.http.HttpBackOffUnsuccessfulResponseHandler
import com.google.api.client.http.HttpHeaders
import com.google.api.client.http.HttpRequest
import com.google.api.client.http.HttpResponse
import com.google.api.client.http.HttpResponseException
import com.google.api.client.http.HttpTransport
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.http.json.JsonHttpContent
import com.google.api.client.json.jackson2.JacksonFactory
import com.google.api.client.util.ExponentialBackOff

class FcmSender {
	
	def grailsApplication
	/*
	 * https://firebase.google.com/docs/cloud-messaging/http-server-ref
	 *
	 * 알림 메시지 example
	 *   {
	 "to" : "bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...",
	 "notification" : {
	 "body" : "great match!",
	 "title" : "Portugal vs. Denmark",
	 "icon" : "myicon"
	 }
	 }
	 *
	 *
	 * 데이터 메시지 example
	 * {
	 "to" : "bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...",
	 "data" : {
	 "Nick" : "Mario",
	 "body" : "great match!",
	 "Room" : "PortugalVSDenmark"
	 },
	 }
	 */

	//def sendToFcm(PushSend send, List<PushMessage> messages) {
	def sendToFcm(PushSend send, List<PushMessage> messages) {
		messages.each {
			requestToFcm(it.token, send.pushMessageType, send.body, send.shortContent, send.link)
		}
	}
	
	def requestToFcm(String token, PushMessageType pushMessageType, String body, String title, String link) {

		/*		int max = 100
		 int offset = 0
		 def messageList = nextToken(send, offset, max)
		 */	

		
		//StringBuffer temp = new StringBuffer()
		//messages.each {
			/*if(temp.length()> 0) {
				temp.append(";")	// 토큰 간의 구분자 -> FCM규격대로 수정필요
			}
			temp.append(it.token)*/
			
			def postJson;
			
			if ( pushMessageType == PushMessageType.TEXT ) {
				postJson = [
					to : token,
					notification : [
						body : body,
						title : title,
						click_action: 'FCM_PLUGIN_ACTIVITY'
					]
				]
			} else if ( pushMessageType == PushMessageType.LINK ) {
				postJson = [
					to : token,
					notification : [
						body : body,
						title : title,
						click_action: 'FCM_PLUGIN_ACTIVITY'
					],
					data : [
						link : link,
					]
				]
			}
			
			log.info "postJson: ${postJson}"
	
			HttpTransport transport = new NetHttpTransport()
	
			HttpRequest request = transport.createRequestFactory().buildPostRequest(
					new GenericUrl(grailsApplication.config.fcm.request.url),
					new JsonHttpContent(new JacksonFactory(), postJson));
	
			HttpHeaders reqHeaders = new HttpHeaders()
			
			def auth = "key=${grailsApplication.config.fcm.legacy.server.key}"
			
			reqHeaders.setAuthorization(auth)
			reqHeaders.setAccept("application/json")
			reqHeaders.setContentType("application/json")
	
			request.setHeaders(reqHeaders)
	
			request.setUnsuccessfulResponseHandler(new HttpBackOffUnsuccessfulResponseHandler(new ExponentialBackOff.Builder()
					.setInitialIntervalMillis(500)
					.setMaxElapsedTimeMillis(900000)
					.setMaxIntervalMillis(6000)
					.setMultiplier(1.5)
					.setRandomizationFactor(0.5)
					.build()
					))
	
			try {
				HttpResponse response = request.execute();
	
				InputStream is = response.getContent()
				BufferedReader br = new BufferedReader(new InputStreamReader(is))
	
				StringBuilder sb = new StringBuilder();
	
				String line = null;
				try {
					while ((line = br.readLine()) != null) {
						sb.append(line);
					}
				} catch (IOException e) {
					e.printStackTrace();
				} finally {
					try {
						is.close();
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
	
				ObjectMapper mapper = new ObjectMapper()
				Map<String, Object> responseMap = mapper.readValue(sb.toString(), new TypeReference<Map<String, Object>>(){})
	
				// Process response JSON per https://firebase.google.com/docs/cloud-messaging/server#response
				if (responseMap && (responseMap['failure'] != 0 || responseMap['canonical_ids'] != 0)) {
					if ( responseMap['message_id'] && responseMap['registration_id'] ) {
						log.info "New push token, setting to ${responseMap['registration_id']}"
						// TODO Notify backend that token has changed, i.e. update
					}
				} else {
					def results = responseMap['results']
	
					if(results) {
						results.each {
							if(it['error']) {
								if(it['error'] == "NotRegistered") {
									log.info 'NotRegistered, updating AppToken to null'
									// TODO Notify backend this token is no longer valid, i.e. delete
								}
							}
						}
					}
				}
	
				//render responseMap as JSON
	
				println "${responseMap as JSON}"
	
				return responseMap
	
			} catch(HttpResponseException e) {
				log.error "Error: ${e.toString()}"
				//render (['SC' : e.getStatusCode(), 'M' : e.getStatusMessage() ]) as JSON
	
				println "${(['SC' : e.getStatusCode(), 'M' : e.getStatusMessage() ]) as JSON}"
	
				throw new SgspException('-1', e.toString())
			}
		//}
		// def to = temp.toString()
	}
}

