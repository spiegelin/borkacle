package com.borkacle.service;

import com.borkacle.model.*; // Use controller models
import com.borkacle.repository.TareaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
// Removed bot specific import: import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional; // Keep if transaction management is desired

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

// Copied from bot service
@Service
public class TareaService {
    private static final Logger logger = LoggerFactory.getLogger(TareaService.class);

    @Autowired
    private TareaRepository tareaRepository;

    // Inject controller services
    @Autowired
    private EstadoService estadoService;

    @Autowired
    private PrioridadService prioridadService;

    @Autowired
    private SprintService sprintService;

    @Autowired
    private UsuarioService usuarioService;

    // --- Add Task --- //
    @Transactional
    public Tarea createTarea(String titulo, String descripcion, Double tiempoEstimado, Long proyectoId, Long prioridadId) {
        logger.info("Creating task: Title={}, ProjectID={}", titulo, proyectoId);
        try {
            Tarea tarea = new Tarea();
            tarea.setTitulo(titulo);
            tarea.setDescripcion(descripcion);
            tarea.setTiempoEstimado(tiempoEstimado);
            tarea.setFechaCreacion(OffsetDateTime.now());
            tarea.setFechaActualizacion(OffsetDateTime.now());
            // Assuming ProyectoId is relevant. If Proyecto is a full entity, adjust accordingly.
            tarea.setProyectoId(proyectoId);

            Estado estado = estadoService.findByNombre("Pendiente"); // Ensure "Pendiente" exists or handle creation
            tarea.setEstado(estado);
            logger.info("Initial state set: {}", estado.getNombre());

            if (prioridadId != null) {
                try {
                    Prioridad prioridad = prioridadService.findById(prioridadId);
                    tarea.setPrioridad(prioridad);
                    logger.info("Priority set: {}", prioridad.getNombre());
                } catch (RuntimeException e) {
                    logger.warn("Priority with ID {} not found, proceeding without priority.", prioridadId);
                    // Decide if task creation should fail if priority is not found
                }
            }

            Tarea savedTarea = tareaRepository.save(tarea);
            logger.info("Task saved successfully. ID: {}", savedTarea.getId());
            return savedTarea;
        } catch (Exception e) {
            logger.error("Error creating task: {}", e.getMessage(), e);
            // Rethrow a more specific exception for the controller to handle (e.g., ServiceException)
            throw new RuntimeException("Failed to create task", e);
        }
    }

    // --- Assign User --- //
    @Transactional
    public Tarea assignUser(Long tareaId, Long usuarioId) {
        logger.info("Assigning user {} to task {}", usuarioId, tareaId);
        try {
            Tarea tarea = tareaRepository.findById(tareaId)
                    .orElseThrow(() -> new RuntimeException("Task not found with id: " + tareaId));
            Usuario usuario = usuarioService.findById(usuarioId); // Throws if not found

            tarea.setAsignadoA(usuario);
            tarea.setFechaActualizacion(OffsetDateTime.now());
            Tarea savedTarea = tareaRepository.save(tarea);
            logger.info("User assigned successfully to task {}", tareaId);
            return savedTarea;
        } catch (RuntimeException e) {
            logger.error("Error assigning user: {}", e.getMessage(), e);
            throw e; // Rethrow for controller advice to handle
        }
    }

    // --- Assign Sprint --- //
    @Transactional
    public Tarea assignSprint(Long tareaId, Long sprintId) {
        logger.info("Assigning sprint {} to task {}", sprintId, tareaId);
        try {
            Tarea tarea = tareaRepository.findById(tareaId)
                    .orElseThrow(() -> new RuntimeException("Task not found with id: " + tareaId));
            Sprint sprint = sprintService.findById(sprintId); // Throws if not found

            tarea.setSprint(sprint);
            tarea.setFechaActualizacion(OffsetDateTime.now());
            Tarea savedTarea = tareaRepository.save(tarea);
            logger.info("Sprint assigned successfully to task {}", tareaId);
            return savedTarea;
        } catch (RuntimeException e) {
            logger.error("Error assigning sprint: {}", e.getMessage(), e);
            throw e; // Rethrow for controller advice to handle
        }
    }

    // --- Complete Task --- //
    @Transactional
    public Tarea completeTask(Long tareaId, Double tiempoReal) {
         logger.info("Completing task {} with real time {}", tareaId, tiempoReal);
        try {
            Tarea tarea = tareaRepository.findById(tareaId)
                    .orElseThrow(() -> new RuntimeException("Task not found with id: " + tareaId));

            tarea.setTiempoReal(tiempoReal);
            tarea.setFechaActualizacion(OffsetDateTime.now());

            Estado estado = estadoService.findByNombre("Completado"); // Ensure "Completado" exists
            tarea.setEstado(estado);

            Tarea savedTarea = tareaRepository.save(tarea);
            logger.info("Task {} marked as completed.", tareaId);
            return savedTarea;
        } catch (RuntimeException e) {
            logger.error("Error completing task: {}", e.getMessage(), e);
            throw e;
        }
    }

    // --- Edit Task --- //
    @Transactional
    public Tarea updateTask(Long tareaId, String titulo, String descripcion, Double tiempoEstimado,
                          Long estadoId, Long prioridadId, Long proyectoId, Long sprintId,
                          Double tiempoReal) {
        logger.info("Updating task: ID={}", tareaId);
        try {
            Tarea tarea = tareaRepository.findById(tareaId)
                    .orElseThrow(() -> new RuntimeException("Task not found with id: " + tareaId));

            // Update fields if provided
            if (titulo != null) tarea.setTitulo(titulo);
            if (descripcion != null) tarea.setDescripcion(descripcion);
            if (tiempoEstimado != null) tarea.setTiempoEstimado(tiempoEstimado);
            if (proyectoId != null) tarea.setProyectoId(proyectoId);
            if (tiempoReal != null) tarea.setTiempoReal(tiempoReal);

            if (estadoId != null) {
                try {
                    Estado estado = estadoService.findById(estadoId);
                    tarea.setEstado(estado);
                } catch (RuntimeException e) {
                    logger.warn("Estado with ID {} not found during update, skipping.", estadoId);
                }
            }
            if (prioridadId != null) {
                try {
                    Prioridad prioridad = prioridadService.findById(prioridadId);
                    tarea.setPrioridad(prioridad);
                } catch (RuntimeException e) {
                    logger.warn("Prioridad with ID {} not found during update, skipping.", prioridadId);
                }
            }
             if (sprintId != null) {
                try {
                    Sprint sprint = sprintService.findById(sprintId);
                    tarea.setSprint(sprint);
                } catch (RuntimeException e) {
                    logger.warn("Sprint with ID {} not found during update, skipping.", sprintId);
                }
            }

            tarea.setFechaActualizacion(OffsetDateTime.now());
            Tarea savedTarea = tareaRepository.save(tarea);
            logger.info("Task {} updated successfully.", tareaId);
            return savedTarea;
        } catch (RuntimeException e) {
            logger.error("Error updating task: {}", e.getMessage(), e);
            throw e;
        }
    }

    // --- Other methods potentially useful for APIs --- //

    public Optional<Tarea> findById(Long id) {
        return tareaRepository.findById(id);
    }

    public List<Tarea> findAll() {
        return tareaRepository.findAll();
    }

    public List<Tarea> getTareasBySprint(Long sprintId) {
        // Validate sprint exists first?
        return tareaRepository.findBySprintId(sprintId);
    }

    // Consider adding methods to find tasks by other criteria if needed for API endpoints
} 