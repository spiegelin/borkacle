package com.borkacle.controller.repository;

import com.borkacle.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TareaRepository extends JpaRepository<Tarea, Long> {

    @Query("SELECT DISTINCT t FROM Tarea t LEFT JOIN FETCH t.asignadoA LEFT JOIN FETCH t.sprint LEFT JOIN FETCH t.estado")
    List<Tarea> findAllWithRelations();
} 