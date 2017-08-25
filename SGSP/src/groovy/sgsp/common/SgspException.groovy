package sgsp.common

class SgspException extends Exception {
	def resultCode
	
	SgspException(String resultCode, String message) {
		super(message)
		this.resultCode = resultCode
	}
}
