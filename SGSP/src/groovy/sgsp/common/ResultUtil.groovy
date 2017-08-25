package sgsp.common

import grails.converters.JSON

class ResultUtil {
	static JSON makeResponse(String resultCode, Object object) {
		['resultCode':resultCode, 'data':object] as JSON
	}

	static JSON makeResponse(String resultCode) {
		['resultCode':resultCode] as JSON
	}

	static JSON makeResponse() {
		['resultCode':'0'] as JSON
	}
}
