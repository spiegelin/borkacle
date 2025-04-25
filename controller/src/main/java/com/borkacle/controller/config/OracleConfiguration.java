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

import oracle.jdbc.pool.OracleDataSource;
///*
//    This class grabs the appropriate values for OracleDataSource,
//    The method that uses env, grabs it from the environment variables set
//    in the docker container. The method that uses dbSettings is for local testing
//    @author: peter.song@oracle.com
// */
//
//
@Configuration
public class OracleConfiguration {
    Logger logger = LoggerFactory.getLogger(DbSettings.class);
    
    @Autowired
    private DbSettings dbSettings;
    
    @Autowired
    private Environment env;
    
    @PostConstruct
    public void setOracleConnectionProperties() {
        // Setting system properties for Oracle wallet location
        System.setProperty("oracle.net.wallet_location", 
                "(SOURCE=(METHOD=file)(METHOD_DATA=(DIRECTORY=/Users/spiegel/Documents/PROJECTS/borkacle/wallet)))");
        System.setProperty("oracle.net.tns_admin", "/Users/spiegel/Documents/PROJECTS/borkacle/wallet");
        
        // Setting SSL properties
        System.setProperty("javax.net.ssl.trustStore", "/Users/spiegel/Documents/PROJECTS/borkacle/wallet/truststore.jks");
        System.setProperty("javax.net.ssl.trustStorePassword", "Borkacle123*");
        System.setProperty("javax.net.ssl.keyStore", "/Users/spiegel/Documents/PROJECTS/borkacle/wallet/keystore.jks");
        System.setProperty("javax.net.ssl.keyStorePassword", "Borkacle123*");
        
        logger.info("Oracle connection properties set successfully");
    }
    
    @Bean
    public DataSource dataSource() throws SQLException {
        OracleDataSource ds = new OracleDataSource();
        // ds.setDriverType(env.getProperty("driver_class_name"));
        // logger.info("Using Driver " + env.getProperty("driver_class_name"));
        // ds.setURL(env.getProperty("db_url"));
        // logger.info("Using URL: " + env.getProperty("db_url"));
        // ds.setUser(env.getProperty("db_user"));
        // logger.info("Using Username " + env.getProperty("db_user"));
        // ds.setPassword(env.getProperty("dbpassword"));
        // For local testing
        ds.setDriverType(dbSettings.getDriver_class_name());
        logger.info("Using Driver " + dbSettings.getDriver_class_name());
        ds.setURL(dbSettings.getUrl());
        logger.info("Using URL: " + dbSettings.getUrl());
        ds.setUser(dbSettings.getUsername());
        logger.info("Using Username: " + dbSettings.getUsername());
        ds.setPassword(dbSettings.getPassword());
        
        return ds;
    }
}
