package com.borkacle.controller.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.env.Environment;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;
import java.util.logging.Logger;

@Configuration
public class EnvConfig {
    private static final Logger logger = Logger.getLogger(EnvConfig.class.getName());
    
    @Autowired
    private Environment env;

    @Bean
    public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        PropertySourcesPlaceholderConfigurer configurer = new PropertySourcesPlaceholderConfigurer();
        
        // Try to load .env file if it exists
        File envFile = new File(".env");
        if (envFile.exists()) {
            try {
                Properties props = new Properties();
                FileInputStream fis = new FileInputStream(envFile);
                props.load(fis);
                fis.close();
                
                configurer.setProperties(props);
                configurer.setIgnoreResourceNotFound(true);
                configurer.setIgnoreUnresolvablePlaceholders(true);
                
                logger.info("Loaded environment variables from .env file");
            } catch (IOException e) {
                logger.warning("Failed to load .env file: " + e.getMessage());
            }
        } else {
            logger.info(".env file not found, using system environment variables");
        }
        
        return configurer;
    }
} 