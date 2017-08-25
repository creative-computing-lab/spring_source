package sgsp.sec

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import org.joda.time.DateTime
import org.joda.time.Period
import org.joda.time.format.DateTimeFormat
import org.joda.time.format.DateTimeFormatter

import sgsp.data.Career
import sgsp.data.Degree
import sgsp.data.UserDiv

@EqualsAndHashCode(includes='username')
@ToString(includes='username', includeNames=true, includePackage=false)
class User implements Serializable {

	private static final long serialVersionUID = 1

	transient springSecurityService

	String username
	String password
	boolean enabled = true
	boolean accountExpired
	boolean accountLocked
	boolean passwordExpired

	UserDiv userDiv = UserDiv.NORMAL
	String gender // M, F
	String birthday
	String recommendationCode = ""

	// counselor
	Degree degree
	Career career


	User(String username, String password) {
		this()
		this.username = username
		this.password = password
	}

	Set<Role> getAuthorities() {
		UserRole.findAllByUser(this)*.role
	}

	def getAge() {
		def now = new DateTime()
		DateTimeFormatter fmt = DateTimeFormat.forPattern("yyyy-MM-dd");
		def dob = fmt.parseDateTime(birthday);
		def period = new Period(dob, now)
		period.years
	}

	def getAbout() {
		"${getAgeDesc()} ${getGenderDesc()}"
	}
	
	def getAgeDesc() {
		def age = "";
		int aboutAge = this.getAge()/10
		
		if (aboutAge < 1) {
			age ="10대 이하"
		} else {
			age = aboutAge + "0대";
		}
		
		return age;
	}
	
	def getGenderDesc() {
		def desc = "";
		if(this.gender.equals("M")) {
			desc = "남성"	
		} else if(this.gender.equals("F")) {
			desc = "여성"
		}
		return desc
	}

	def beforeInsert() {
		encodePassword()
	}

	def beforeUpdate() {
		if (isDirty('password')) {
			encodePassword()
		}
	}

	protected void encodePassword() {
		password = springSecurityService?.passwordEncoder ? springSecurityService.encodePassword(password) : password
	}

	static transients = ['springSecurityService']

	static constraints = {
		username blank: false, unique: true
		password blank: false
		degree nullable : true
		career nullable : true
		recommendationCode nullable : true
	}

	static mapping = {
		password column: '`password`'
		gender length : 1
		birthday length : 10
		userDiv enumType:"string"
		degree enumType:"string"
		career enumType:"string"
		username length: 64
		recommendationCode length : 64
	}
}
