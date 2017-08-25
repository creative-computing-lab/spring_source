import sgsp.push.PushRequestService
import util.FcmSender


beans = {
	pushRequestService (PushRequestService) {
		grailsApplication = ref('grailsApplication')
		fcmSender = ref('fcmSender')
	}

	fcmSender(FcmSender) { grailsApplication = ref('grailsApplication') }
}
