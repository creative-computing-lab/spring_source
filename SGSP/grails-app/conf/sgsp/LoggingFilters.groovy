package sgsp

import org.apache.log4j.MDC

class LoggingFilters {

	def filters = {
		all(controller:'*', action:'*') {
			before = {
				def name = request.userPrincipal?.name
				if(name) {
					MDC.put 'username', "($name)"
				}
				log.info "'$request.forwardURI', params: ${new TreeMap(params)}, JSON: $request.JSON"
			}
			afterView = { e -> MDC.remove 'username' }
		}
	}
}
