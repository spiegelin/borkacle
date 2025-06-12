package com.borkacle.repository;

import com.borkacle.model.Tarea;
import com.borkacle.model.Usuario;
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
    
    @Query("SELECT t FROM Tarea t WHERE t.asignadoA.id = :usuarioId AND t.sprint.id = :sprintId")
    List<Tarea> findByUsuarioIdAndSprintId(@Param("usuarioId") Long usuarioId, @Param("sprintId") Long sprintId);

    List<Tarea> findByAsignadoA(Usuario usuario);
    List<Tarea> findByEstadoId(Long estadoId);

    @Query("SELECT t.id, t.titulo, t.descripcion, t.fechaCreacion, e.nombre as estadoNombre " +
           "FROM Tarea t " +
           "JOIN t.estado e " +
           "ORDER BY t.fechaCreacion DESC")
    List<Object[]> findAllWithEstado();

    @Query("SELECT t.id, t.titulo, t.descripcion, t.fechaCreacion, e.nombre as estadoNombre, u.nombre as usuarioNombre " +
           "FROM Tarea t " +
           "LEFT JOIN t.estado e " +
           "LEFT JOIN t.asignadoA u " +
           "ORDER BY t.fechaCreacion DESC")
    List<Object[]> findAllWithEstadoAndUser();

    @Query("SELECT DISTINCT t FROM Tarea t LEFT JOIN FETCH t.asignadoA LEFT JOIN FETCH t.sprint LEFT JOIN FETCH t.estado")
    List<Tarea> findAllWithRelations();
} 