package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.Tarea;
import com.springboot.MyTodoList.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
@EnableTransactionManagement
public interface TareaRepository extends JpaRepository<Tarea, Long> {
    List<Tarea> findByAsignadoA(Usuario usuario);
    List<Tarea> findBySprintId(Long sprintId);
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
} 