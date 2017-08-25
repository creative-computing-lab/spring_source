package sgsp.marshalling

import grails.converters.JSON
import sgsp.sec.User

class UserMarshaller {
	void register() {
		JSON.registerObjectMarshaller(User) { User it ->
			return [
				id : it.id,
				name : it.username
			]
		}
	}
}
