package com.borkacle.service;

import com.borkacle.model.Usuario;
import com.borkacle.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// Copied from bot service, potentially remove bot-specific methods like findByTelegramId if not needed
@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Keep if Telegram ID is relevant for the controller
    public Optional<Usuario> findByTelegramId(String telegramId) {
        return usuarioRepository.findByTelegramId(telegramId);
    }

    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    // Keep or adapt based on controller's user creation/update logic
    // public Usuario createOrUpdateUsuario(String telegramId, String nombre, String email) {
    //     Optional<Usuario> existingUsuario = usuarioRepository.findByTelegramId(telegramId);
    //     if (existingUsuario.isPresent()) {
    //         Usuario usuario = existingUsuario.get();
    //         usuario.setNombre(nombre);
    //         usuario.setEmail(email);
    //         return usuarioRepository.save(usuario);
    //     } else {
    //         Usuario newUsuario = new Usuario();
    //         newUsuario.setTelegramId(telegramId);
    //         newUsuario.setNombre(nombre);
    //         newUsuario.setEmail(email);
    //         newUsuario.setRol("DEVELOPER"); // Consider role management
    //         return usuarioRepository.save(newUsuario);
    //     }
    // }

    public Usuario findById(Long id) {
        // Use orElseThrow or handle Optional appropriately for API context
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario not found with id: " + id));
    }

    // New method to get all users
    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    // New method to update user details
    public Usuario updateUser(Long id, String nombre, String email, String rol, Long equipoId /* Add other fields as needed */) {
        Usuario usuario = findById(id); // Throws exception if not found

        if (nombre != null) {
            usuario.setNombre(nombre);
        }
        if (email != null) {
            // Add validation if email needs to be unique?
            usuario.setEmail(email);
        }
        if (rol != null) {
            usuario.setRol(rol);
        }
        // Add logic to fetch and set Equipo based on equipoId if Equipo is an entity
        // if (equipoId != null) {
        //    Equipo equipo = equipoService.findById(equipoId); // Assuming EquipoService exists
        //    usuario.setEquipo(equipo);
        // }

        // Add other updatable fields here...

        return usuarioRepository.save(usuario); // Save updates
    }
} 