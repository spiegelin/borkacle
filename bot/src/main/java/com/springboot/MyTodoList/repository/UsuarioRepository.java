package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.transaction.Transactional;
import java.util.Optional;

@Repository
@Transactional
@EnableTransactionManagement
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByTelegramId(String telegramId);
    Optional<Usuario> findByEmail(String email);
} 