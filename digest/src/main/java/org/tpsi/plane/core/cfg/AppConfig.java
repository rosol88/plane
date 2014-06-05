package org.tpsi.plane.core.cfg;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import javax.sql.DataSource;

import org.hibernate.jpa.HibernatePersistenceProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories("org.tpsi.plane.core.repo")
@ComponentScan("org.tpsi.plane.core")
public class AppConfig {
    @Autowired
    @Bean
    public DataSource dataSource() {
	try {
	    DriverManagerDataSource dataSource = new DriverManagerDataSource();
	    Properties props = new Properties();
	    InputStream is = this.getClass().getResourceAsStream(
		    "/db.properties");
	    props.load(is);
	    is.close();
	    dataSource.setDriverClassName(props.getProperty("driverClassName"));
	    dataSource.setPassword(props.getProperty("password"));
	    dataSource.setUsername(props.getProperty("username"));
	    dataSource.setUrl(props.getProperty("url"));
	    return dataSource;
	} catch (IOException e) {
	    throw new RuntimeException(e);
	}

    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
	LocalContainerEntityManagerFactoryBean factoryBean = new LocalContainerEntityManagerFactoryBean();
	factoryBean.setDataSource(dataSource());
	factoryBean
		.setPackagesToScan(new String[] { "org.tpsi.plane.core.model" });
	factoryBean
		.setPersistenceProviderClass(HibernatePersistenceProvider.class);
	factoryBean.setJpaProperties(hibProperties());
	return factoryBean;
    }

    private Properties hibProperties() {
	Properties properties = new Properties();
	properties.put("hibernate.dialect",
		"org.hibernate.dialect.PostgreSQLDialect");
	properties.put("hibernate.hbm2ddl.auto", "update");
	properties.put("hibernate.ejb.naming_strategy",
		"org.tpsi.plane.core.cfg.CustomNamingStrategy");
	return properties;
    }

    @Bean
    public PlatformTransactionManager transactionManager() {
	JpaTransactionManager transactionManager = new JpaTransactionManager();
	transactionManager.setEntityManagerFactory(this.entityManagerFactory()
		.getObject());
	return transactionManager;
    }

    @Bean
    public PersistenceExceptionTranslationPostProcessor exceptionTranslation() {
	return new PersistenceExceptionTranslationPostProcessor();
    }

}
