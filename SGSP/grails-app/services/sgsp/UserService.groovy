package sgsp

import grails.transaction.Transactional

import org.apache.commons.lang.RandomStringUtils
import org.joda.time.format.DateTimeFormat
import org.joda.time.format.DateTimeFormatter

import sgsp.common.SgspException
import sgsp.data.ResultCode
import sgsp.data.UserDiv
import sgsp.sec.Role
import sgsp.sec.User
import sgsp.sec.UserRole

@Transactional
class UserService {

	def springSecurityService
	def postsService
	
	def create(jsonObject) {
		User user = new User(jsonObject)
		boolean validate = false
		if(user) {
			if(user.username && user.password && user.gender && user.birthday ) {
				DateTimeFormatter fmt = DateTimeFormat.forPattern("yyyy-MM-dd");
				def dob = fmt.parseDateTime(user.birthday);
				if(dob.isBeforeNow()) {
					if(user.gender=='M' || user.gender=='F') {
						if(user.userDiv==UserDiv.NORMAL) {
							validate = true
						} else if (user.userDiv==UserDiv.COUNSELOR && user.degree && user.career) {
							validate = true
						}
					}
				}
			}
		}

		if(validate) {
			User searchUser = User.findByUsername(user.username)
			if ( searchUser == null ) {
				if(!(user.validate() && user.save())) {
					user.errors.allErrors.each { log.error it }
					throw new IllegalArgumentException(user.errors.allErrors.join(" "))
				}
	
				def authorities = []
				if(user.id > 0) {
					if(user.userDiv==UserDiv.NORMAL) {
						authorities = ['ROLE_USER']
					} else if (user.userDiv==UserDiv.COUNSELOR) {
						authorities = ['ROLE_COUNSELOR']
					}
				}
	
				authorities.each { authority ->
					UserRole.create user, Role.findByAuthority(authority), true
				}
				return true
			} else {
				throw new SgspException(ResultCode.FAIL, "동일한 아이디가 존재합니다.");
			}
		} else {
			throw new SgspException(ResultCode.FAIL, "입력된 값을 확인해주세요");
		}
		return false
	}



	def findPwd(jsonObject) {
		User params = new User(jsonObject)
		if(params) {
			User user = User.createCriteria().get() {
				and {
					eq 'username', params.username
					eq 'birthday', params.birthday
					if( params.recommendationCode!=null &&  params.recommendationCode.length() > 0) {
						eq 'recommendationCode', params.recommendationCode
					}
				}
			}
			if(user) {
				def newpassword = RandomStringUtils.randomNumeric 4
				user.password = newpassword
				if(!(user.validate() && user.save())) {
					user.errors.allErrors.each { log.error it }
					throw new IllegalArgumentException(user.errors.allErrors.join(" "))
				}
				return ['newpassword' : newpassword]
			}
		}
		return null
	}

	def updatePwd(jsonObject) {
		def user = springSecurityService.currentUser
		if(user) {
			if(jsonObject) {
				def passwordCurrent = jsonObject.passwordCurrent
				def passwordNew = jsonObject.passwordNew

				if (passwordCurrent&&passwordNew ) {
					if (!springSecurityService.passwordEncoder.isPasswordValid(user.password, passwordCurrent, null)) {
						throw new SgspException(ResultCode.FAIL, "비밀번호가 맞지 않습니다.");
					}
					if (springSecurityService.passwordEncoder.isPasswordValid(user.password, passwordNew, null )) {
						throw new SgspException(ResultCode.FAIL, "현재의 비밀번호와 다른 번호로 변경해주세요.");
					}
					user.password = passwordNew
					if(!(user.validate() && user.save())) {
						user.errors.allErrors.each { log.error it }
						throw new IllegalArgumentException(user.errors.allErrors.join(" "))
					}
					return true
				}
			}
		}
		return false;
	}

	def list(params) {
		params.max = Math.min(params.max ? params.int('max') : 10, 100)
		params.offset = params.offset?params.int('offset') :0
		params.sort = params.sort?params.sort:'id'
		params.order = params.order?params.order:'desc'

		def results = User.createCriteria().list(max: params.max, offset: params.offset) {
			order params.sort, params.order
		}


		return [list: results.collect{User it->
				def temp = [
					id : it.id,
					username : it.username,
					userDiv : it.userDiv.name(),
					userDivDesc : it.userDiv.displayName,
					gender : it.getGenderDesc(),
					birthday : it.birthday,
					recommendationCode : it.recommendationCode
				]
				if(it.userDiv == UserDiv.NORMAL) {
					temp.putAll(postsService.countByUser(it))
				} else if (it.userDiv == UserDiv.COUNSELOR) {
					temp.put('degree', it.degree?.displayName)
					temp.put('career', it.career?.displayName)
					temp.putAll(postsService.counselingCountByUser(it))
				}
				temp
			}, count:results?.size(), total: results?.getTotalCount()]
	}
}