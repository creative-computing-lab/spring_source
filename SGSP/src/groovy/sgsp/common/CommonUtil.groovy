package sgsp.common

import grails.converters.JSON

class CommonUtil {
	
	def renderSuccessAsJSON() {
		return render(['success':true] as JSON)
	}
	
	def saveDomainObj(obj) {
		if(obj.validate() && obj.save()) {
			return obj
		} else {
			obj.errors.allErrors.each { log.error it }
			throw new IllegalArgumentException(obj.errors.allErrors.join(" "))
		}
	}
}
