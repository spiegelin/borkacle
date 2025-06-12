package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.repository.SprintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class SprintService {

    @Autowired
    private SprintRepository sprintRepository;

    public Sprint findById(Long id) {
        return sprintRepository.findById(id).orElse(null);
    }

    public Sprint getCurrentSprint() {
        Optional<Sprint> currentSprint = sprintRepository.findFirstByOrderByFechaInicioDesc();
        return currentSprint.orElse(null);
    }

    public List<Sprint> getActiveSprints() {
        return sprintRepository.findByEstado("Activo");
    }

    public Sprint createSprint(String nombre, LocalDate fechaInicio, LocalDate fechaFin) {
        Sprint sprint = new Sprint();
        sprint.setNombre(nombre);
        sprint.setFechaInicio(fechaInicio);
        sprint.setFechaFin(fechaFin);
        sprint.setEstado("Activo");
        return sprintRepository.save(sprint);
    }

    public Sprint updateSprint(Long id, String nombre, LocalDate fechaInicio, LocalDate fechaFin, String estado) {
        Sprint sprint = findById(id);
        if (sprint != null) {
            sprint.setNombre(nombre);
            sprint.setFechaInicio(fechaInicio);
            sprint.setFechaFin(fechaFin);
            sprint.setEstado(estado);
            return sprintRepository.save(sprint);
        }
        return null;
    }

    public void deleteSprint(Long id) {
        sprintRepository.deleteById(id);
    }

    public List<Object[]> findAllSprintsWithTasks() {
        return sprintRepository.findAllSprintsWithTasks();
    }
} 