package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.Estado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.transaction.Transactional;

@Repository
@Transactional
@EnableTransactionManagement
public interface EstadoRepository extends JpaRepository<Estado, Long> {
    Estado findByNombre(String nombre);
} 