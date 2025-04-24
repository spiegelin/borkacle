package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
@EnableTransactionManagement
public interface SprintRepository extends JpaRepository<Sprint, Long> {
    Optional<Sprint> findFirstByOrderByFechaInicioDesc();
    List<Sprint> findByEstado(String estado);

    @Query("SELECT s.id, s.nombre, s.fechaInicio, s.fechaFin, s.estado, t.id, t.titulo " +
           "FROM Sprint s " +
           "LEFT JOIN Tarea t ON t.sprint.id = s.id " +
           "ORDER BY s.fechaInicio DESC")
    List<Object[]> findAllSprintsWithTasks();
} 