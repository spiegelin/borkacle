package com.borkacle.repository;

import com.borkacle.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface TareaRepository extends JpaRepository<Tarea, Long> {
    
    @Query("SELECT t FROM Tarea t WHERE t.asignadoA.equipo.id = :equipoId")
    List<Tarea> findByEquipoId(@Param("equipoId") Long equipoId);
    
    @Query("SELECT t FROM Tarea t WHERE t.asignadoA.equipo.id = :equipoId AND t.sprint.id = :sprintId")
    List<Tarea> findByEquipoIdAndSprintId(@Param("equipoId") Long equipoId, @Param("sprintId") Long sprintId);
    
    @Query("SELECT t FROM Tarea t WHERE t.sprint.id = :sprintId")
    List<Tarea> findBySprintId(@Param("sprintId") Long sprintId);
} 