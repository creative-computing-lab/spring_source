dataSource {
    pooled = true
    jmxExport = true
    driverClassName = "org.h2.Driver"
    username = "sa"
    password = ""
}
hibernate {
    cache.use_second_level_cache = true
    cache.use_query_cache = false
    cache.region.factory_class = 'net.sf.ehcache.hibernate.EhCacheRegionFactory' // Hibernate 3
//    cache.region.factory_class = 'org.hibernate.cache.ehcache.EhCacheRegionFactory' // Hibernate 4
    singleSession = true // configure OSIV singleSession mode
}

// environment specific settings
environments {
    development {
        dataSource {
            dbCreate = "create-drop" // one of 'create', 'create-drop', 'update', 'validate', ''
            url = "jdbc:h2:mem:devDb;MVCC=TRUE;LOCK_TIMEOUT=10000;DB_CLOSE_ON_EXIT=FALSE"
        }
    }
    test {
        dataSource {
            dbCreate = "update"
            url = "jdbc:h2:mem:testDb;MVCC=TRUE;LOCK_TIMEOUT=10000;DB_CLOSE_ON_EXIT=FALSE"
        }
    }

	/*production {
		dataSource {
			dbCreate = 'update'
			jndiName = "java:comp/env/sgsp"
			dialect = org.hibernate.dialect.MySQL5InnoDBDialect
			useUnicode='yes'
			characterEncoding='UTF-8'
			pooled = true
		}
	}*/
	
	def commonProductionConfig = {
		dbCreate = "update"
		driverClassName = "org.mariadb.jdbc.Driver"
		dialect = org.hibernate.dialect.MySQL5InnoDBDialect
		pooled = true
		properties {
		   maxIdle=10
		   maxActive = 200
		   maxWait=10000
		   minEvictableIdleTimeMillis=1800000
		   timeBetweenEvictionRunsMillis=1800000
		   numTestsPerEvictionRun=3
		   testOnBorrow=true
		   testWhileIdle=true
		   testOnReturn=true
		   validationQuery="SELECT 1"
		}
		loggingSql=false
	}

	production {
		dataSource {
			commonProductionConfig.delegate = delegate
			commonProductionConfig.call()
			url = "jdbc:mariadb://localhost:3306/sgsp?useUnicode=yes&characterEncoding=UTF-8"
			username="sgsp"
			password="R2017x405!"
		}
	}
	
	/*
	def commonProductionConfig = {
		dbCreate = "update"
		driverClassName = "com.mysql.jdbc.Driver"
		dialect = org.hibernate.dialect.MySQL5InnoDBDialect
		pooled = true
		properties {
		   maxActive = -1
		   minEvictableIdleTimeMillis=1800000
		   timeBetweenEvictionRunsMillis=1800000
		   numTestsPerEvictionRun=3
		   testOnBorrow=true
		   testWhileIdle=true
		   testOnReturn=true
		   validationQuery="SELECT 1"
		}
		loggingSql=false
	}
	
    production {
		dataSource {
			commonProductionConfig.delegate = delegate
			commonProductionConfig.call()
			url = "jdbc:mysql://localhost:3306/spring?characterEncoding=UTF-8"
			username="root"
			password="nextage2020"
		}
    }
    */
}