package com.borkacle.controller;

import com.borkacle.model.Tarea;
import com.borkacle.service.TareaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map; // For simple request bodies
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks") // Base path for task-related endpoints
public class TaskController {

    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);

    @Autowired
    private TareaService tareaService;

    // --- DTOs (Consider creating separate DTO classes for cleaner request/response handling) --- //
    // Example DTO for creating a task
    public static class CreateTaskRequest {
        public String titulo;
        public String descripcion;
        public Double tiempoEstimado;
        public Long proyectoId;
        public Long prioridadId; // Optional
    }

    // Example DTO for editing a task
    public static class EditTaskRequest {
        public String titulo; // Optional
        public String descripcion; // Optional
        public Double tiempoEstimado; // Optional
        public Long estadoId; // Optional
        public Long prioridadId; // Optional
        public Long proyectoId; // Optional
        public Long sprintId; // Optional
        public Double tiempoReal; // Optional
        public String tipo; // Optional
        public Long userId; // Optional - for user assignment
    }

    // New DTO for simplified task list response
    public static class TaskSummaryListDto {
        public Long id;
        public String titulo;
        public String estado; // Simplified
        public String prioridad; // Simplified
        public String asignadoA; // Simplified
        public Long sprintId;
        public String sprintNombre;
        public OffsetDateTime fechaCreacion;

        public TaskSummaryListDto(Tarea tarea) {
            this.id = tarea.getId();
            this.titulo = tarea.getTitulo();
            this.estado = tarea.getEstado() != null ? tarea.getEstado().getNombre() : null;
            this.prioridad = tarea.getPrioridad() != null ? tarea.getPrioridad().getNombre() : null;
            this.asignadoA = tarea.getAsignadoA() != null ? tarea.getAsignadoA().getNombre() : null;
            this.sprintId = tarea.getSprint() != null ? tarea.getSprint().getId() : null;
            this.sprintNombre = tarea.getSprint() != null ? tarea.getSprint().getNombre() : null;
            this.fechaCreacion = tarea.getFechaCreacion();
        }
    }

    // New DTO for detailed task response
    public static class TaskDetailDto {
        public Long id;
        public String titulo;
        public String descripcion;
        public String estado;
        public String prioridad;
        public String asignadoA;
        public Long proyectoId;
        public String sprint; // Include Sprint name
        public OffsetDateTime fechaCreacion;
        public OffsetDateTime fechaActualizacion;
        public Double tiempoEstimado;
        public Double tiempoReal;
        // `tipo` is not in the Tarea model, so it's omitted.

        public TaskDetailDto(Tarea tarea) {
            this.id = tarea.getId();
            this.titulo = tarea.getTitulo();
            this.descripcion = tarea.getDescripcion();
            this.estado = tarea.getEstado() != null ? tarea.getEstado().getNombre() : null;
            this.prioridad = tarea.getPrioridad() != null ? tarea.getPrioridad().getNombre() : null;
            this.asignadoA = tarea.getAsignadoA() != null ? tarea.getAsignadoA().getNombre() : null;
            this.proyectoId = tarea.getProyectoId();
            this.sprint = tarea.getSprint() != null ? tarea.getSprint().getNombre() : null;
            this.fechaCreacion = tarea.getFechaCreacion();
            this.fechaActualizacion = tarea.getFechaActualizacion();
            this.tiempoEstimado = tarea.getTiempoEstimado();
            this.tiempoReal = tarea.getTiempoReal();
        }
    }

    // --- Add Task --- //
    @PostMapping
    public ResponseEntity<Tarea> addTask(@RequestBody CreateTaskRequest request) {
        // Basic validation (consider adding more robust validation)
        if (request.titulo == null || request.titulo.isEmpty()) {
            return ResponseEntity.badRequest().build(); // Or return a specific error message
        }
        Tarea nuevaTarea = tareaService.createTarea(
            request.titulo,
            request.descripcion,
            request.tiempoEstimado,
            request.proyectoId,
            request.prioridadId
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaTarea);
    }

    // --- Assign User --- //
    // Expecting a request body like: {"userId": 123}
    @PutMapping("/{taskId}/assignUser")
    public ResponseEntity<?> assignUserToTask(@PathVariable Long taskId, @RequestBody Map<String, Long> payload) {
        try {
            logger.info("Received user assignment request for task {}: {}", taskId, payload);
            Long usuarioId = payload.get("userId");
            if (usuarioId == null) {
                logger.error("No userId provided in request");
                return ResponseEntity.badRequest().body(Map.of("error", "userId is required"));
            }
            
            Tarea tareaActualizada = tareaService.assignUser(taskId, usuarioId);
            if (tareaActualizada == null) {
                logger.error("Task not found with id: {}", taskId);
                return ResponseEntity.notFound().build();
            }
            
            logger.info("Successfully assigned user {} to task {}", usuarioId, taskId);
            return ResponseEntity.ok(new TaskDetailDto(tareaActualizada));
        } catch (Exception e) {
            logger.error("Error assigning user to task {}: {}", taskId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error assigning user: " + e.getMessage()));
        }
    }

    // --- Assign Sprint --- //
    // Expecting a request body like: {"sprintId": 456}
    @PutMapping("/{taskId}/assignSprint")
    public ResponseEntity<Tarea> assignSprintToTask(@PathVariable Long taskId, @RequestBody Map<String, Long> payload) {
        Long sprintId = payload.get("sprintId");
         if (sprintId == null) {
             return ResponseEntity.badRequest().body(null);
        }
        Tarea tareaActualizada = tareaService.assignSprint(taskId, sprintId);
        return ResponseEntity.ok(tareaActualizada);
    }

    // --- Complete Task --- //
    // Expecting a request body like: {"tiempoReal": 5.5}
    @PutMapping("/{taskId}/complete")
    public ResponseEntity<Tarea> completeTask(@PathVariable Long taskId, @RequestBody Map<String, Double> payload) {
        Double tiempoReal = payload.get("tiempoReal");
         if (tiempoReal == null) {
             return ResponseEntity.badRequest().body(null);
        }
        Tarea tareaCompletada = tareaService.completeTask(taskId, tiempoReal);
        return ResponseEntity.ok(tareaCompletada);
    }

    // --- Edit Task --- //
    @PutMapping("/{taskId}")
    public ResponseEntity<?> editTask(@PathVariable Long taskId, @RequestBody EditTaskRequest request) {
        try {
            logger.info("Received edit request for task {}: {}", taskId, request);
            
            // First update the task with the provided fields
            Tarea tareaActualizada = tareaService.updateTask(
                taskId,
                request.titulo,
                request.descripcion,
                request.tiempoEstimado,
                request.estadoId,
                request.prioridadId,
                request.proyectoId,
                request.sprintId,
                request.tiempoReal,
                request.tipo
            );
            
            if (tareaActualizada == null) {
                return ResponseEntity.notFound().build();
            }

            // If userId is provided, assign the user
            if (request.userId != null) {
                logger.info("Assigning user {} to task {}", request.userId, taskId);
                tareaActualizada = tareaService.assignUser(taskId, request.userId);
                if (tareaActualizada == null) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Failed to assign user to task"));
                }
            }

            // Save the task to ensure all changes are persisted
            tareaActualizada = tareaService.save(tareaActualizada);
            return ResponseEntity.ok(new TaskDetailDto(tareaActualizada));
        } catch (Exception e) {
            logger.error("Error updating task {}: {}", taskId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error updating task: " + e.getMessage()));
        }
    }

    // --- Get Task by ID (Updated to return detailed DTO) --- //
    @GetMapping("/{taskId}")
    public ResponseEntity<TaskDetailDto> getTaskById(@PathVariable Long taskId) {
        return tareaService.findById(taskId)
            .map(tarea -> ResponseEntity.ok(new TaskDetailDto(tarea))) // Map to new DTO
            .orElse(ResponseEntity.notFound().build());
    }

    // --- Get All Tasks (Existing - uses TaskSummaryListDto) --- //
    @GetMapping
    public ResponseEntity<List<TaskSummaryListDto>> getAllTasks() {
        List<Tarea> tareas = tareaService.findAll();
        // Map to DTO
        List<TaskSummaryListDto> tareaDtos = tareas.stream()
                                                  .map(TaskSummaryListDto::new)
                                                  .collect(Collectors.toList());
        return ResponseEntity.ok(tareaDtos);
    }

    // --- New Endpoint to change Estado (using /assignPriority path) --- //
    @PutMapping("/{taskId}/assignPriority")
    public ResponseEntity<TaskDetailDto> assignPriorityToTask(@PathVariable Long taskId, @RequestBody Map<String, Long> payload) {
        Long estadoId = payload.get("estadoId");
        if (estadoId == null) {
            return ResponseEntity.badRequest().build(); // Or return a specific error message
        }
        // Use existing updateTask service method, passing null for fields not being changed
        try {
            Tarea tareaActualizada = tareaService.updateTask(taskId, null, null, null, estadoId, null, null, null, null, null);
            return ResponseEntity.ok(new TaskDetailDto(tareaActualizada)); // Return updated task details
        } catch (RuntimeException e) {
            // Handle specific exceptions (like TaskNotFound, EstadoNotFound) potentially with ControllerAdvice
            // For now, return a generic error or rethrow depending on desired handling
             if (e.getMessage().contains("Task not found") || e.getMessage().contains("Estado not found")) {
                 return ResponseEntity.notFound().build();
             }
             // Log the error details
             System.err.println("Error updating task state: " + e.getMessage());
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
} 