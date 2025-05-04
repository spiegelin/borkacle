package com.borkacle.controller.controller;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.borkacle.controller.payload.JwtResponse;
import com.borkacle.controller.payload.LoginRequest;
import com.borkacle.controller.payload.MessageResponse;
import com.borkacle.controller.payload.SignupRequest;
import com.borkacle.controller.security.JwtUtils;
import com.borkacle.model.Usuario;
import com.borkacle.repository.UsuarioRepository;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        
        Usuario usuario = usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return ResponseEntity.ok(new JwtResponse(jwt, 
                                                 usuario.getId(), 
                                                 usuario.getEmail(), 
                                                 usuario.getNombre(),
                                                 usuario.getRol()));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (usuarioRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        Usuario usuario = new Usuario();
        usuario.setNombre(signUpRequest.getNombre());
        usuario.setEmail(signUpRequest.getEmail());
        usuario.setPasswordHash(encoder.encode(signUpRequest.getPassword()));
        usuario.setRol(signUpRequest.getRol() != null ? signUpRequest.getRol() : "usuario");
        usuario.setFechaRegistro(OffsetDateTime.now());
        usuario.setMfaEnabled("N");

        usuarioRepository.save(usuario);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    // --- Logout Endpoint --- //
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        // For stateless JWT, the primary action is on the client (discarding the token).
        // This backend endpoint acknowledges the request and potentially allows for future
        // server-side invalidation logic (e.g., token blocklisting) if implemented.
        // SecurityContextHolder.clearContext(); // Use if using Spring Security sessions

        return ResponseEntity.ok().body("Logout successful");
    }
} 