package sgsp

import sgsp.common.ResultUtil
import sgsp.data.SendStatus
import sgsp.data.SendToType

class CodeController {
	
	def sendStatus () {
		def value = SendStatus.values()
		if(value) {
			return render (ResultUtil.makeResponse('0', toMap(value)))
		}
		return render (ResultUtil.makeResponse())
	}

	def toType () {
		def value = SendToType.values()
		if(value) {
			return render (ResultUtil.makeResponse('0', toMap(value)))
		}
		return render (ResultUtil.makeResponse())
	}

	private toMap(value) {
		value.collect {it->
			[
				key:it.name(),
				value:it.displayName
			]
		}
	}
}
