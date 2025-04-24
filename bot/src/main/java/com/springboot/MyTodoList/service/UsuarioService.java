package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Usuario;
import com.springboot.MyTodoList.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Optional<Usuario> findByTelegramId(String telegramId) {
        return usuarioRepository.findByTelegramId(telegramId);
    }

    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public Usuario createOrUpdateUsuario(String telegramId, String nombre, String email) {
        Optional<Usuario> existingUsuario = usuarioRepository.findByTelegramId(telegramId);
        if (existingUsuario.isPresent()) {
            Usuario usuario = existingUsuario.get();
            usuario.setNombre(nombre);
            usuario.setEmail(email);
            return usuarioRepository.save(usuario);
        } else {
            Usuario newUsuario = new Usuario();
            newUsuario.setTelegramId(telegramId);
            newUsuario.setNombre(nombre);
            newUsuario.setEmail(email);
            newUsuario.setRol("DEVELOPER");
            return usuarioRepository.save(newUsuario);
        }
    }

    public Usuario findById(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario not found with id: " + id));
    }
} 