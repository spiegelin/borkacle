package com.borkacle.controller;

import com.borkacle.model.Usuario;
import com.borkacle.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UsuarioService usuarioService;

    // --- DTOs --- //
    // DTO for User List (ID, Name, Equipo, Email)
    public static class UserListDto {
        public Long id;
        public String nombre;
        public String email;
        public String equipoNombre; // Simplified

        public UserListDto(Usuario usuario) {
            this.id = usuario.getId();
            this.nombre = usuario.getNombre();
            this.email = usuario.getEmail();
            this.equipoNombre = usuario.getEquipo() != null ? usuario.getEquipo().getNombre() : null;
        }
    }

    // DTO for User Detail (Cleaned)
    public static class UserDetailDto {
        public Long id;
        public String nombre;
        public String email;
        public String rol;
        public String equipoNombre; // Simplified
        // Add other relevant fields, cleaned as needed

        public UserDetailDto(Usuario usuario) {
            this.id = usuario.getId();
            this.nombre = usuario.getNombre();
            this.email = usuario.getEmail();
            this.rol = usuario.getRol();
            this.equipoNombre = usuario.getEquipo() != null ? usuario.getEquipo().getNombre() : null;
        }
    }

    // DTO for Update User Request
    public static class UpdateUserRequest {
        public String nombre; // Optional
        public String email; // Optional
        public String rol; // Optional
        public Long equipoId; // Optional
        // Add other fields that can be updated
    }

    // --- Get All Users --- //
    @GetMapping
    public ResponseEntity<List<UserListDto>> getAllUsers() {
        List<Usuario> users = usuarioService.findAll();
        List<UserListDto> userDtos = users.stream()
                                          .map(UserListDto::new)
                                          .collect(Collectors.toList());
        return ResponseEntity.ok(userDtos);
    }

    // --- Get User by ID --- //
    @GetMapping("/{userId}")
    public ResponseEntity<UserDetailDto> getUserById(@PathVariable Long userId) {
        try {
            Usuario user = usuarioService.findById(userId);
            return ResponseEntity.ok(new UserDetailDto(user));
        } catch (RuntimeException e) {
            // Assuming findById throws RuntimeException if not found
            return ResponseEntity.notFound().build();
        }
    }

     // --- Update User by ID --- //
     @PutMapping("/{userId}")
     public ResponseEntity<UserDetailDto> updateUser(@PathVariable Long userId, @RequestBody UpdateUserRequest request) {
         // Add authorization checks here: Is the logged-in user allowed to update this user?
         // e.g., Check if user is admin or if userId matches logged-in user's ID.

         try {
             Usuario updatedUser = usuarioService.updateUser(
                 userId,
                 request.nombre,
                 request.email,
                 request.rol,
                 request.equipoId
                 // Pass other fields from request
             );
             return ResponseEntity.ok(new UserDetailDto(updatedUser));
         } catch (RuntimeException e) {
             // Handle specific errors, e.g., UserNotFound
             if (e.getMessage().contains("not found")) {
                 return ResponseEntity.notFound().build();
             }
             // Handle potential validation errors (e.g., email format, duplicate email if checked)
             // Log error
             System.err.println("Error updating user: " + e.getMessage());
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
         }
     }
} 