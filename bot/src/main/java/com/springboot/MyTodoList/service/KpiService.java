package com.springboot.MyTodoList.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class KpiService {
    private static final Logger logger = LoggerFactory.getLogger(KpiService.class);
    
    private final RestTemplate restTemplate;
    private final String controllerServiceUrl;
    
    @Value("${controller.auth.username:admin@example.com}")
    private String username;
    
    @Value("${controller.auth.password:admin123}")
    private String password;
    
    @Value("${controller.jwt.token:}")
    private String configuredJwtToken;
    
    // Mapa para almacenar tokens por email de usuario
    private Map<String, String> userTokens = new ConcurrentHashMap<>();
    
    private String authToken;
    
    public KpiService(RestTemplate restTemplate, 
                     @Value("${controller.service.url:http://controller:8080}") String controllerServiceUrl) {
        this.restTemplate = restTemplate;
        this.controllerServiceUrl = controllerServiceUrl;
        logger.info("KpiService initialized with controller URL: {}, username: {}", controllerServiceUrl, username);
        
        // Si tenemos un token configurado, usarlo directamente
        if (configuredJwtToken != null && !configuredJwtToken.isEmpty()) {
            this.authToken = configuredJwtToken;
            logger.info("Using pre-configured JWT token from properties");
        }
    }
    
    /**
     * Autentica al usuario con el controlador y almacena su token
     * @param email Email del usuario
     * @param password Contraseña del usuario
     * @return El token JWT obtenido o null si falla
     */
    public String authenticateWithController(String email, String password) {
        try {
            String authUrl = controllerServiceUrl + "/api/auth/login";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            
            // Construir el JSON para la petición de login
            String requestBody = String.format("{\"email\":\"%s\",\"password\":\"%s\"}", email, password);
            
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
            
            logger.info("Authenticating user with controller: {}", email);
            
            try {
                ResponseEntity<String> response = restTemplate.exchange(
                    authUrl, HttpMethod.POST, entity, String.class);
                
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    String responseBody = response.getBody();
                    logger.debug("Authentication response body: {}", responseBody);
                    
                    if (responseBody.contains("\"token\"")) {
                        int tokenStart = responseBody.indexOf("\"token\"") + 9;
                        int tokenEnd = responseBody.indexOf("\"", tokenStart);
                        if (tokenStart > 9 && tokenEnd > tokenStart) {
                            String token = responseBody.substring(tokenStart, tokenEnd);
                            // Guardar el token para este usuario
                            userTokens.put(email, token);
                            // También usarlo como token actual del servicio
                            this.authToken = token;
                            logger.info("Controller authentication successful for user: {}", email);
                            return token;
                        }
                    }
                }
                
                logger.error("Controller authentication failed for user: {}", email);
                return null;
            } catch (HttpClientErrorException e) {
                logger.error("Controller authentication error for user {}: {} - {}", 
                           email, e.getStatusCode(), e.getResponseBodyAsString());
                return null;
            }
        } catch (Exception e) {
            logger.error("Error in controller authentication for user {}: {}", email, e.getMessage());
            return null;
        }
    }
    
    private boolean authenticate() {
        // Si ya hay un token configurado, no intentar autenticar
        if (configuredJwtToken != null && !configuredJwtToken.isEmpty()) {
            logger.info("Using pre-configured JWT token instead of authentication");
            this.authToken = configuredJwtToken;
            return true;
        }
        
        try {
            String authUrl = controllerServiceUrl + "/api/auth/login";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            
            // Construir el JSON para la petición de login
            String requestBody = String.format("{\"email\":\"%s\",\"password\":\"%s\"}", username, password);
            
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
            
            logger.info("Attempting authentication at {} with email: {}", authUrl, username);
            
            try {
                ResponseEntity<String> response = restTemplate.exchange(
                    authUrl, HttpMethod.POST, entity, String.class);
                
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    String responseBody = response.getBody();
                    logger.info("Authentication response received, status: {}", response.getStatusCode());
                    logger.debug("Authentication response body: {}", responseBody);
                    
                    if (responseBody.contains("\"token\"")) {
                        int tokenStart = responseBody.indexOf("\"token\"") + 9;
                        int tokenEnd = responseBody.indexOf("\"", tokenStart);
                        if (tokenStart > 9 && tokenEnd > tokenStart) {
                            this.authToken = responseBody.substring(tokenStart, tokenEnd);
                            logger.info("Authentication successful, token length: {}", authToken.length());
                            return true;
                        } else {
                            logger.error("Error parsing token from response: Invalid token position");
                            return false;
                        }
                    } else {
                        logger.error("Token not found in response: {}", responseBody);
                        return false;
                    }
                } else {
                    logger.error("Authentication failed with status: {}", response.getStatusCode());
                    return false;
                }
            } catch (HttpClientErrorException e) {
                logger.error("Authentication HTTP client error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
                return false;
            } catch (HttpServerErrorException e) {
                logger.error("Authentication HTTP server error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
                return false;
            } catch (Exception e) {
                logger.error("Authentication request error: {}", e.getMessage());
                return false;
            }
        } catch (Exception e) {
            logger.error("Error preparing authentication request: {}", e.getMessage(), e);
            return false;
        }
    }
    
    private HttpHeaders createAuthHeaders() {
        HttpHeaders headers = new HttpHeaders();
        
        if (authToken == null || authToken.isEmpty()) {
            logger.info("No auth token available, attempting to authenticate...");
            if (!authenticate()) {
                logger.error("Failed to obtain authentication token");
                return headers;
            }
        }
        
        headers.set("Authorization", "Bearer " + authToken);
        logger.debug("Created auth header with token length: {}", authToken.length());
        return headers;
    }
    
    public String getKpiEquipoData() {
        try {
            logger.info("Fetching KPI data for teams from controller");
            String url = controllerServiceUrl + "/api/kpi";
            
            HttpEntity<String> entity = new HttpEntity<>(createAuthHeaders());
            
            try {
                ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, String.class);
                
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    logger.info("Successfully retrieved team KPI data");
                    return response.getBody();
                } else {
                    logger.error("Failed to get team KPI data. Status: {}", response.getStatusCode());
                    return null;
                }
            } catch (HttpClientErrorException e) {
                logger.error("KPI team data HTTP client error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
                if (e.getStatusCode().value() == 401) {
                    logger.info("Unauthorized error, will try to re-authenticate next time");
                    // Solo resetear si no estamos usando un token pre-configurado
                    if (configuredJwtToken == null || configuredJwtToken.isEmpty()) {
                        authToken = null;
                    }
                }
                return null;
            }
        } catch (Exception e) {
            logger.error("Error getting team KPI data: {}", e.getMessage(), e);
            return null;
        }
    }
    
    public String getKpiPersonaData() {
        try {
            logger.info("Fetching KPI data for users from controller");
            String url = controllerServiceUrl + "/api/kpi/persona";
            
            HttpEntity<String> entity = new HttpEntity<>(createAuthHeaders());
            
            try {
                ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, String.class);
                
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    logger.info("Successfully retrieved user KPI data");
                    return response.getBody();
                } else {
                    logger.error("Failed to get user KPI data. Status: {}", response.getStatusCode());
                    return null;
                }
            } catch (HttpClientErrorException e) {
                logger.error("KPI user data HTTP client error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
                if (e.getStatusCode().value() == 401) {
                    logger.info("Unauthorized error, will try to re-authenticate next time");
                    // Solo resetear si no estamos usando un token pre-configurado
                    if (configuredJwtToken == null || configuredJwtToken.isEmpty()) {
                        authToken = null;
                    }
                }
                return null;
            }
        } catch (Exception e) {
            logger.error("Error getting user KPI data: {}", e.getMessage(), e);
            return null;
        }
    }
} 