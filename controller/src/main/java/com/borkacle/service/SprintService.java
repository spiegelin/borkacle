package com.borkacle.service;

import com.borkacle.model.Sprint;
import com.borkacle.repository.SprintRepository;
import com.borkacle.model.Tarea;
import com.borkacle.repository.TareaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
// Removed bot specific import: import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

// Copied from bot service
@Service
public class SprintService {

    @Autowired
    private SprintRepository sprintRepository;

    @Autowired // Inject TareaRepository
    private TareaRepository tareaRepository;

    public Sprint findById(Long id) {
        // Use orElseThrow or handle Optional appropriately for API context
        return sprintRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Sprint not found with id: " + id));
    }

    // Decide if getCurrentSprint logic is needed for API
    // public Sprint getCurrentSprint() {
    //     Optional<Sprint> currentSprint = sprintRepository.findFirstByOrderByFechaInicioDesc();
    //     return currentSprint.orElse(null); // Handle null for API
    // }

    // Decide if getActiveSprints logic is needed for API
    public List<Sprint> getActiveSprints() {
        return sprintRepository.findByEstado("Activo");
    }

    // Decide if create/update/delete sprint logic belongs here or in a dedicated Admin/Sprint controller
    public Sprint createSprint(String nombre, LocalDate fechaInicio, LocalDate fechaFin) {
        Sprint sprint = new Sprint();
        sprint.setNombre(nombre);
        sprint.setFechaInicio(fechaInicio);
        sprint.setFechaFin(fechaFin);
        sprint.setEstado("Activo"); // Default state
        return sprintRepository.save(sprint);
    }

    public Sprint updateSprint(Long id, String nombre, LocalDate fechaInicio, LocalDate fechaFin, String estado) {
        Sprint sprint = findById(id); // Uses the findById with exception handling
        sprint.setNombre(nombre);
        sprint.setFechaInicio(fechaInicio);
        sprint.setFechaFin(fechaFin);
        sprint.setEstado(estado);
        return sprintRepository.save(sprint);
    }

    public void deleteSprint(Long id) {
        // Add check if sprint exists before deleting
        if (!sprintRepository.existsById(id)) {
             throw new RuntimeException("Sprint not found with id: " + id);
        }
        sprintRepository.deleteById(id);
    }

    // Decide if needed for API. Consider returning a DTO instead of Object[]
    public List<Object[]> findAllSprintsWithTasks() {
        return sprintRepository.findAllSprintsWithTasks();
    }

    // Add specific method for Show Sprint functionality if different from findById
    public Sprint showSprintDetails(Long id) {
        // This might just be findById, or could include fetching related tasks eagerly
        return findById(id);
    }

    // New method to fetch tasks associated with a specific sprint ID
    public List<Tarea> findTasksBySprintId(Long sprintId) {
        return tareaRepository.findBySprintId(sprintId);
    }
} 