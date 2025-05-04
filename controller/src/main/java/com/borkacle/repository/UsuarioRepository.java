package com.borkacle.repository;

import com.borkacle.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Methods from bot
    Optional<Usuario> findByTelegramId(String telegramId);
    Optional<Usuario> findByEmail(String email);
    Boolean existsByEmail(String email);
} 