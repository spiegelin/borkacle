package com.borkacle.controller.config;


import java.sql.SQLException;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;

import oracle.jdbc.pool.OracleDataSource;
///*
//    This class grabs the appropriate values for OracleDataSource,
//    The method that uses env, grabs it from the environment variables set
//    in the docker container. The method that uses dbSettings is for local testing
//    @author: peter.song@oracle.com
// */
//
//
@Profile("!test")
@Configuration
public class OracleConfiguration {
    private static final Logger logger = LoggerFactory.getLogger(OracleConfiguration.class);
    
    @Value("${spring.datasource.url}")
    private String jdbcUrl;
    
    @Value("${spring.datasource.username}")
    private String username;
    
    @Value("${spring.datasource.password}")
    private String password;
    
    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;
    
    @Value("${oracle.net.wallet_location}")
    private String walletLocation;

    @Value("${oracle.net.tns_admin}")
    private String tnsAdmin;

    @Value("${javax.net.ssl.trustStore}")
    private String trustStore;

    @Value("${javax.net.ssl.trustStorePassword}")
    private String trustStorePassword;

    @Value("${javax.net.ssl.keyStore}")
    private String keyStore;

    @Value("${javax.net.ssl.keyStorePassword}")
    private String keyStorePassword;
    
    @PostConstruct
    public void setOracleConnectionProperties() {
        try {
            // Setting system properties for Oracle wallet location
            System.setProperty("oracle.net.wallet_location", walletLocation);
            System.setProperty("oracle.net.tns_admin", tnsAdmin);
            
            // Setting SSL properties
            System.setProperty("javax.net.ssl.trustStore", trustStore);
            System.setProperty("javax.net.ssl.trustStorePassword", trustStorePassword);
            System.setProperty("javax.net.ssl.keyStore", keyStore);
            System.setProperty("javax.net.ssl.keyStorePassword", keyStorePassword);
            
            logger.info("Oracle connection properties set successfully");
            logger.info("Using TNS_ADMIN: {}", tnsAdmin);
            logger.info("Using wallet location: {}", walletLocation);
        } catch (Exception e) {
            logger.error("Error setting Oracle connection properties", e);
        }
    }
    
    @Bean
    public DataSource dataSource() throws SQLException {
        try {
            OracleDataSource ds = new OracleDataSource();
            ds.setDriverType(driverClassName);
            ds.setURL(jdbcUrl);
            ds.setUser(username);
            ds.setPassword(password);
            
            logger.info("Oracle DataSource configured successfully");
            logger.info("Using URL: {}", jdbcUrl);
            logger.info("Using Driver: {}", driverClassName);
            logger.info("Using Username: {}", username);
            
            return ds;
        } catch (SQLException e) {
            logger.error("Error creating Oracle DataSource", e);
            throw e;
        }
    }
}
