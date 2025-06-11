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
import java.util.stream.Collectors;

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
        public String estado;

        public TaskSummaryDto(Long id, String titulo, String estado) {
            this.id = id;
            this.titulo = titulo;
            this.estado = estado;
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
    public ResponseEntity<Map<String, Object>> showSprint(@PathVariable Long sprintId) {
        // Fetch the sprint details
        Sprint sprint = sprintService.showSprintDetails(sprintId);

        // Fetch associated tasks
        List<Tarea> tasks = sprintService.findTasksBySprintId(sprintId);

        // Organizar las tareas por estado
        Map<String, List<Map<String, Object>>> columns = new LinkedHashMap<>();
        columns.put("todo", new ArrayList<>());
        columns.put("inProgress", new ArrayList<>());
        columns.put("review", new ArrayList<>());
        columns.put("blocked", new ArrayList<>());
        columns.put("done", new ArrayList<>());
        columns.put("cancelled", new ArrayList<>());

        // Mapear las tareas a sus columnas correspondientes
        for (Tarea task : tasks) {
            Map<String, Object> taskMap = new LinkedHashMap<>();
            taskMap.put("id", task.getId());
            taskMap.put("title", task.getTitulo());
            taskMap.put("type", task.getTipo() != null ? task.getTipo().toLowerCase() : "task");
            taskMap.put("priority", mapPriority(task.getPrioridad() != null ? task.getPrioridad().getId() : null));
            taskMap.put("description", task.getDescripcion());
            
            // Mapear el asignado si existe
            if (task.getAsignadoA() != null) {
                Map<String, Object> assignee = new LinkedHashMap<>();
                assignee.put("name", task.getAsignadoA().getNombre());
                assignee.put("initials", getInitials(task.getAsignadoA().getNombre()));
                taskMap.put("assignee", assignee);
            }

            // Determinar la columna basada en el estado
            String columnKey = mapEstadoToColumn(task.getEstado() != null ? task.getEstado().getNombre() : null);
            columns.get(columnKey).add(taskMap);
        }

        // Crear la respuesta final
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", sprint.getId());
        response.put("nombre", sprint.getNombre());
        response.put("fechaInicio", sprint.getFechaInicio());
        response.put("fechaFin", sprint.getFechaFin());
        response.put("estado", sprint.getEstado());
        response.put("columns", columns);

        return ResponseEntity.ok(response);
    }

    private String mapEstadoToColumn(String estado) {
        if (estado == null) return "todo";
        
        switch (estado.toLowerCase()) {
            case "completado": return "done";
            case "en proceso": return "inProgress";
            case "pendiente": return "todo";
            case "en revisión": return "review";
            case "bloqueado": return "blocked";
            case "cancelado": return "cancelled";
            default: return "todo";
        }
    }

    private String mapPriority(Long prioridadId) {
        if (prioridadId == null) return "medium";
        
        switch (prioridadId.intValue()) {
            case 1: return "highest";
            case 2: return "high";
            case 3: return "medium";
            case 4: return "low";
            case 5: return "lowest";
            default: return "medium";
        }
    }

    private String getInitials(String name) {
        if (name == null || name.isBlank()) {
            return "??";
        }
        
        String[] parts = name.split("\\s+");
        if (parts.length == 1) {
            return name.substring(0, Math.min(2, name.length())).toUpperCase();
        }
        
        return (parts[0].charAt(0) + "" + parts[parts.length - 1].charAt(0)).toUpperCase();
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
            LocalDate sprintFechaInicio = (row[2] instanceof java.sql.Date) ? ((java.sql.Date)row[2]).toLocalDate() : (LocalDate) row[2];
            LocalDate sprintFechaFin = (row[3] instanceof java.sql.Date) ? ((java.sql.Date)row[3]).toLocalDate() : (LocalDate) row[3];
            String sprintEstado = (String) row[4];
            Long taskId = (Long) row[5];
            String taskTitulo = (String) row[6];
            String taskEstado = (String) row[7];

            // Get or create Sprint DTO
            SprintWithTasksDto sprintDto = sprintMap.computeIfAbsent(sprintId, id ->
                new SprintWithTasksDto(sprintId, sprintNombre, sprintFechaInicio, sprintFechaFin, sprintEstado)
            );

            // Add task summary if a task exists for this row
            if (taskId != null) {
                sprintDto.tasks.add(new TaskSummaryDto(taskId, taskTitulo, taskEstado));
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