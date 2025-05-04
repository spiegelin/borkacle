package com.borkacle.repository;

import com.borkacle.model.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, Long> {
    // Methods from bot
    Optional<Sprint> findFirstByOrderByFechaInicioDesc();
    List<Sprint> findByEstado(String estado);

    @Query("SELECT s.id, s.nombre, s.fechaInicio, s.fechaFin, s.estado, t.id, t.titulo " +
           "FROM Sprint s " +
           "LEFT JOIN Tarea t ON t.sprint.id = s.id " +
           "ORDER BY s.fechaInicio DESC")
    List<Object[]> findAllSprintsWithTasks(); // Keep or remove based on needs
} 