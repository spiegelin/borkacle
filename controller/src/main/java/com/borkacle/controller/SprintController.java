package com.borkacle.controller;

import com.borkacle.model.Sprint;
import com.borkacle.model.Tarea;
import com.borkacle.service.SprintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sprints") // Base path for sprint-related endpoints
public class SprintController {

    @Autowired
    private SprintService sprintService;

    // --- DTOs for structured response ---
    // Simple DTO for Task summary within a Sprint response
    public static class TaskSummaryDto {
        public Long id;
        public String titulo;

        public TaskSummaryDto(Long id, String titulo) {
            this.id = id;
            this.titulo = titulo;
        }
    }

    // DTO for Sprint details including a list of tasks
    public static class SprintWithTasksDto {
        public Long id;
        public String nombre;
        public LocalDate fechaInicio;
        public LocalDate fechaFin;
        public String estado;
        public List<TaskSummaryDto> tasks = new ArrayList<>();

         // Constructor matching the Object[] structure from the query
        public SprintWithTasksDto(Long id, String nombre, LocalDate fechaInicio, LocalDate fechaFin, String estado) {
            this.id = id;
            this.nombre = nombre;
            this.fechaInicio = fechaInicio;
            this.fechaFin = fechaFin;
            this.estado = estado;
        }
    }

    // New DTO for creating a sprint
    public static class CreateSprintRequest {
        public String nombre;
        public LocalDate fechaInicio;
        public LocalDate fechaFin;
        // Estado is set automatically by the service
    }

    // --- Show Sprint by ID (Updated) --- //
    @GetMapping("/{sprintId}")
    public ResponseEntity<SprintWithTasksDto> showSprint(@PathVariable Long sprintId) {
        // Fetch the sprint details
        Sprint sprint = sprintService.showSprintDetails(sprintId); // Throws exception if not found

        // Fetch associated tasks
        List<Tarea> tasks = sprintService.findTasksBySprintId(sprintId);

        // Create DTO
        SprintWithTasksDto sprintDto = new SprintWithTasksDto(
            sprint.getId(),
            sprint.getNombre(),
            sprint.getFechaInicio(),
            sprint.getFechaFin(),
            sprint.getEstado()
        );

        // Add task summaries to DTO
        tasks.forEach(task -> sprintDto.tasks.add(new TaskSummaryDto(task.getId(), task.getTitulo())));

        return ResponseEntity.ok(sprintDto);
    }

    // --- Get All Sprints with Tasks (New) --- //
    @GetMapping
    public ResponseEntity<List<SprintWithTasksDto>> getAllSprintsWithTasks() {
        List<Object[]> rawResults = sprintService.findAllSprintsWithTasks();
        Map<Long, SprintWithTasksDto> sprintMap = new LinkedHashMap<>(); // LinkedHashMap preserves insertion order

        // Process the raw Object[] list from the JOIN query
        for (Object[] row : rawResults) {
            Long sprintId = (Long) row[0];
            String sprintNombre = (String) row[1];
            // Assuming date types are returned correctly; adjust casting if necessary
            LocalDate sprintFechaInicio = (row[2] instanceof java.sql.Date) ? ((java.sql.Date)row[2]).toLocalDate() : (LocalDate) row[2];
            LocalDate sprintFechaFin = (row[3] instanceof java.sql.Date) ? ((java.sql.Date)row[3]).toLocalDate() : (LocalDate) row[3];
            String sprintEstado = (String) row[4];
            Long taskId = (Long) row[5];
            String taskTitulo = (String) row[6];

            // Get or create Sprint DTO
            SprintWithTasksDto sprintDto = sprintMap.computeIfAbsent(sprintId, id ->
                new SprintWithTasksDto(sprintId, sprintNombre, sprintFechaInicio, sprintFechaFin, sprintEstado)
            );

            // Add task summary if a task exists for this row
            if (taskId != null) {
                sprintDto.tasks.add(new TaskSummaryDto(taskId, taskTitulo));
            }
        }

        return ResponseEntity.ok(new ArrayList<>(sprintMap.values()));
    }

    // --- Create Sprint (New) --- //
    @PostMapping
    public ResponseEntity<Sprint> createSprint(@RequestBody CreateSprintRequest request) {
        // Basic validation
        if (request.nombre == null || request.nombre.isEmpty() ||
            request.fechaInicio == null || request.fechaFin == null) {
            return ResponseEntity.badRequest().build();
        }
        // Add validation: fechaInicio must be before or same as fechaFin
        if (request.fechaInicio.isAfter(request.fechaFin)) {
             return ResponseEntity.badRequest().body(null); // Consider adding error message
        }

        try {
            Sprint newSprint = sprintService.createSprint(
                request.nombre,
                request.fechaInicio,
                request.fechaFin
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(newSprint);
        } catch (Exception e) {
            // Log error
            System.err.println("Error creating sprint: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Add other sprint-related endpoints if needed (e.g., update, delete)
} 