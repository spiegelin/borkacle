package com.borkacle.repository;

import com.borkacle.model.Prioridad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrioridadRepository extends JpaRepository<Prioridad, Long> {
    Prioridad findByNombre(String nombre);
} 