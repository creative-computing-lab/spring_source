package sgsp

import com.hazelcast.core.ILock



class PushJob {
	static triggers = {
		simple name:'PushJob', startDelay:5000, repeatInterval: 10, repeatCount: -1
	}

	def hazelService
	def pushBatchService


	def execute() {
		// 처리 전에 lock
		try {
			ILock lock = hazelService.lock("lock")
			try {
				lock.lock()
				// 전송가능한 한 건을 읽어와 전송 준비한다. (PREPARING -> READY_TO_SEND)
				pushBatchService.prepareMessage()
				pushBatchService.prepareFeed()
			} finally {
				// 마무리시 unlock
				lock.unlock()
			}
		} catch (e) {
			log.error(e.getMessage())
		}
	}
}
