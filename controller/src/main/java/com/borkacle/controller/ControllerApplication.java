package com.borkacle.controller;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.client.RestTemplate;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EntityScan("com.borkacle.model")
@EnableJpaRepositories("com.borkacle.repository")
@ComponentScan(basePackages = "com.borkacle")
public class ControllerApplication {

    private static final Logger log = LoggerFactory.getLogger(ControllerApplication.class);
    
    @Autowired
    private DataSource dataSource;
    
    public static void main(String[] args) {
        SpringApplication.run(ControllerApplication.class, args);
    }
    
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    
    @Bean
    CommandLineRunner testDatabaseConnection() {
        return args -> {
            log.info("Testing database connection...");
            try (Connection connection = dataSource.getConnection()) {
                log.info("Successfully connected to Oracle Database");
                
                try (Statement statement = connection.createStatement();
                     ResultSet resultSet = statement.executeQuery("SELECT 'Database connection test successful!' FROM dual")) {
                    
                    if (resultSet.next()) {
                        log.info("Database test result: {}", resultSet.getString(1));
                    }
                    
                    // Test Oracle version
                    try (ResultSet versionResult = statement.executeQuery("SELECT BANNER FROM v$version WHERE ROWNUM = 1")) {
                        if (versionResult.next()) {
                            log.info("Oracle version: {}", versionResult.getString(1));
                        }
                    } catch (SQLException e) {
                        log.warn("Could not retrieve Oracle version: {}", e.getMessage());
                    }
                }
            } catch (SQLException e) {
                log.error("Failed to connect to Oracle Database: {}", e.getMessage(), e);
                
                // Print connection properties for debugging
                log.debug("Database URL: {}", System.getProperty("spring.datasource.url"));
                log.debug("Wallet location: {}", System.getProperty("oracle.net.wallet_location"));
                
                throw new RuntimeException("Database connection test failed", e);
            }
        };
    }
} 