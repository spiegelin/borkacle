package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.*;
import com.springboot.MyTodoList.repository.TareaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TareaService {
    private static final Logger logger = LoggerFactory.getLogger(TareaService.class);

    @Autowired
    private TareaRepository tareaRepository;

    @Autowired
    private EstadoService estadoService;

    @Autowired
    private PrioridadService prioridadService;

    @Autowired
    private SprintService sprintService;

    @Autowired
    private UsuarioService usuarioService;

    @Transactional
    public Tarea createTarea(String titulo, String descripcion, Double tiempoEstimado, Long proyectoId, Long prioridadId) {
        logger.info("Iniciando creación de tarea en servicio: Título={}, ProyectoID={}", titulo, proyectoId);
        try {
            Tarea tarea = new Tarea();
            tarea.setTitulo(titulo);
            tarea.setDescripcion(descripcion);
            tarea.setTiempoEstimado(tiempoEstimado);
            tarea.setFechaCreacion(OffsetDateTime.now());
            tarea.setFechaActualizacion(OffsetDateTime.now());
            tarea.setProyectoId(proyectoId);

            // Set estado inicial a Pendiente
            Estado estado = estadoService.findByNombre("Pendiente");
            if (estado == null) {
                logger.error("Estado 'Pendiente' no encontrado en la base de datos");
                return null;
            }
            tarea.setEstado(estado);
            logger.info("Estado asignado: {}", estado.getNombre());

            // Set prioridad if provided
            if (prioridadId != null) {
                Prioridad prioridad = prioridadService.findById(prioridadId);
                if (prioridad == null) {
                    logger.warn("Prioridad con ID {} no encontrada", prioridadId);
                } else {
                    tarea.setPrioridad(prioridad);
                    logger.info("Prioridad asignada: {}", prioridad.getNombre());
                }
            }

            Tarea savedTarea = tareaRepository.save(tarea);
            logger.info("Tarea guardada con éxito. ID generado: {}", savedTarea.getId());
            return savedTarea;
        } catch (Exception e) {
            logger.error("Error al crear tarea: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Transactional
    public Tarea assignUser(Long tareaId, Long usuarioId) {
        logger.info("Asignando usuario {} a tarea {}", usuarioId, tareaId);
        try {
            Optional<Tarea> optionalTarea = tareaRepository.findById(tareaId);
            if (optionalTarea.isPresent()) {
                Tarea tarea = optionalTarea.get();
                Usuario usuario = usuarioService.findById(usuarioId);
                if (usuario == null) {
                    logger.error("Usuario con ID {} no encontrado", usuarioId);
                    return null;
                }
                tarea.setAsignadoA(usuario);
                tarea.setFechaActualizacion(OffsetDateTime.now());
                Tarea savedTarea = tareaRepository.save(tarea);
                logger.info("Usuario asignado correctamente a la tarea {}", tareaId);
                return savedTarea;
            } else {
                logger.error("Tarea con ID {} no encontrada", tareaId);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error al asignar usuario: {}", e.getMessage(), e);
            throw e;
        }
    }

    public Tarea assignSprint(Long tareaId, Long sprintId) {
        Optional<Tarea> optionalTarea = tareaRepository.findById(tareaId);
        if (optionalTarea.isPresent()) {
            Tarea tarea = optionalTarea.get();
            Sprint sprint = sprintService.findById(sprintId);
            tarea.setSprint(sprint);
            tarea.setFechaActualizacion(OffsetDateTime.now());
            return tareaRepository.save(tarea);
        }
        return null;
    }

    public Tarea completeTask(Long tareaId, Double tiempoReal) {
        Optional<Tarea> optionalTarea = tareaRepository.findById(tareaId);
        if (optionalTarea.isPresent()) {
            Tarea tarea = optionalTarea.get();
            tarea.setTiempoReal(tiempoReal);
            tarea.setFechaActualizacion(OffsetDateTime.now());
            
            // Set estado to Completado
            Estado estado = estadoService.findByNombre("Completado");
            tarea.setEstado(estado);
            
            return tareaRepository.save(tarea);
        }
        return null;
    }

    @Transactional
    public Tarea updateTask(Long tareaId, String titulo, String descripcion, Double tiempoEstimado, 
                          Long estadoId, Long prioridadId, Long proyectoId, Long sprintId,
                          Double tiempoReal) {
        logger.info("Actualizando tarea: ID={}", tareaId);
        try {
            Optional<Tarea> optionalTarea = tareaRepository.findById(tareaId);
            if (optionalTarea.isPresent()) {
                Tarea tarea = optionalTarea.get();
                
                // Update only non-null values
                if (titulo != null) {
                    tarea.setTitulo(titulo);
                    logger.info("Título actualizado: {}", titulo);
                }
                if (descripcion != null) {
                    tarea.setDescripcion(descripcion);
                    logger.info("Descripción actualizada");
                }
                if (tiempoEstimado != null) {
                    tarea.setTiempoEstimado(tiempoEstimado);
                    logger.info("Tiempo estimado actualizado: {}", tiempoEstimado);
                }
                if (estadoId != null) {
                    Estado estado = estadoService.findById(estadoId);
                    if (estado != null) {
                        tarea.setEstado(estado);
                        logger.info("Estado actualizado: {}", estado.getNombre());
                    } else {
                        logger.warn("Estado con ID {} no encontrado", estadoId);
                    }
                }
                if (prioridadId != null) {
                    Prioridad prioridad = prioridadService.findById(prioridadId);
                    if (prioridad != null) {
                        tarea.setPrioridad(prioridad);
                        logger.info("Prioridad actualizada: {}", prioridad.getNombre());
                    } else {
                        logger.warn("Prioridad con ID {} no encontrada", prioridadId);
                    }
                }
                if (proyectoId != null) {
                    tarea.setProyectoId(proyectoId);
                    logger.info("Proyecto ID actualizado: {}", proyectoId);
                }
                if (sprintId != null) {
                    Sprint sprint = sprintService.findById(sprintId);
                    if (sprint != null) {
                        tarea.setSprint(sprint);
                        logger.info("Sprint actualizado: {}", sprint.getNombre());
                    } else {
                        logger.warn("Sprint con ID {} no encontrado", sprintId);
                    }
                }
                if (tiempoReal != null) {
                    tarea.setTiempoReal(tiempoReal);
                    logger.info("Tiempo real actualizado: {}", tiempoReal);
                }
                
                tarea.setFechaActualizacion(OffsetDateTime.now());
                Tarea savedTarea = tareaRepository.save(tarea);
                logger.info("Tarea actualizada correctamente");
                return savedTarea;
            } else {
                logger.error("Tarea con ID {} no encontrada", tareaId);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error al actualizar tarea: {}", e.getMessage(), e);
            throw e;
        }
    }

    public List<Tarea> getTareasByUsuario(Usuario usuario) {
        return tareaRepository.findByAsignadoA(usuario);
    }

    public List<Tarea> getTareasBySprint(Long sprintId) {
        return tareaRepository.findBySprintId(sprintId);
    }

    public List<Tarea> getTareasByEstado(String estadoNombre) {
        Estado estado = estadoService.findByNombre(estadoNombre);
        return tareaRepository.findByEstadoId(estado.getId());
    }

    public List<Tarea> getTareasByEstado(Long estadoId) {
        return tareaRepository.findByEstadoId(estadoId);
    }

    public List<Tarea> findAll() {
        return tareaRepository.findAll();
    }

    @Query("SELECT t.id, t.titulo, t.descripcion, t.fechaCreacion, e.nombre as estadoNombre, u.nombre as usuarioNombre " +
           "FROM Tarea t " +
           "LEFT JOIN t.estado e " +
           "LEFT JOIN t.asignadoA u " +
           "ORDER BY t.fechaCreacion DESC")
    public List<Object[]> findAllWithEstadoAndUser() {
        return tareaRepository.findAllWithEstadoAndUser();
    }
} 