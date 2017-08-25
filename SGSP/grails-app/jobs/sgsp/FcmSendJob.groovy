package sgsp

import com.hazelcast.core.ILock



class FcmSendJob {
	static triggers = {
		simple name:'FcmSendJob', startDelay:5000, repeatInterval: 10, repeatCount: -1
	}

	def hazelService
	def pushRequestService


	def execute() {
		// 처리 전에 lock
		try {
			ILock lock = hazelService.lock("lock")
			try {
				lock.lock()
				// 전송가능한 한 건을 읽어와 전송한다. (SENDING -> DONE)
				pushRequestService.sendMessage()
				pushRequestService.sendFeed()

			}finally {
				// 마무리시 unlock
				lock.unlock()
			}
		}catch (e) {
			log.error(e.getMessage())
		}
	}
}