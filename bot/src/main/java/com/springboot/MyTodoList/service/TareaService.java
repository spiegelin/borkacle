package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.*;
import com.springboot.MyTodoList.repository.TareaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.jpa.repository.Query;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TareaService {

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

    public Tarea createTarea(String titulo, String descripcion, Double tiempoEstimado, Long proyectoId, String tipo, Long prioridadId) {
        Tarea tarea = new Tarea();
        tarea.setTitulo(titulo);
        tarea.setDescripcion(descripcion);
        tarea.setTiempoEstimado(tiempoEstimado);
        tarea.setFechaCreacion(OffsetDateTime.now());
        tarea.setFechaActualizacion(OffsetDateTime.now());
        tarea.setTipo(tipo);
        tarea.setProyectoId(proyectoId);

        // Set estado inicial a Pendiente
        Estado estado = estadoService.findByNombre("Pendiente");
        tarea.setEstado(estado);

        // Set prioridad if provided
        if (prioridadId != null) {
            Prioridad prioridad = prioridadService.findById(prioridadId);
            tarea.setPrioridad(prioridad);
        }

        return tareaRepository.save(tarea);
    }

    public Tarea assignUser(Long tareaId, Long usuarioId) {
        Optional<Tarea> optionalTarea = tareaRepository.findById(tareaId);
        if (optionalTarea.isPresent()) {
            Tarea tarea = optionalTarea.get();
            Usuario usuario = usuarioService.findById(usuarioId);
            tarea.setAsignadoA(usuario);
            tarea.setFechaActualizacion(OffsetDateTime.now());
            return tareaRepository.save(tarea);
        }
        return null;
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

    public Tarea updateTask(Long tareaId, String titulo, String descripcion, Double tiempoEstimado, 
                          Long estadoId, Long prioridadId, Long proyectoId, Long sprintId,
                          Double tiempoReal, String tipo) {
        Optional<Tarea> optionalTarea = tareaRepository.findById(tareaId);
        if (optionalTarea.isPresent()) {
            Tarea tarea = optionalTarea.get();
            
            // Update only non-null values
            if (titulo != null) tarea.setTitulo(titulo);
            if (descripcion != null) tarea.setDescripcion(descripcion);
            if (tiempoEstimado != null) tarea.setTiempoEstimado(tiempoEstimado);
            if (estadoId != null) {
                Estado estado = estadoService.findById(estadoId);
                tarea.setEstado(estado);
            }
            if (prioridadId != null) {
                Prioridad prioridad = prioridadService.findById(prioridadId);
                tarea.setPrioridad(prioridad);
            }
            if (proyectoId != null) tarea.setProyectoId(proyectoId);
            if (sprintId != null) {
                Sprint sprint = sprintService.findById(sprintId);
                tarea.setSprint(sprint);
            }
            if (tiempoReal != null) tarea.setTiempoReal(tiempoReal);
            if (tipo != null) tarea.setTipo(tipo);
            
            tarea.setFechaActualizacion(OffsetDateTime.now());
            return tareaRepository.save(tarea);
        }
        return null;
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

    @Query("SELECT t.id, t.titulo, t.descripcion, t.fechaCreacion, t.tipo, e.nombre as estadoNombre, u.nombre as usuarioNombre " +
           "FROM Tarea t " +
           "LEFT JOIN t.estado e " +
           "LEFT JOIN t.asignadoA u " +
           "ORDER BY t.fechaCreacion DESC")
    public List<Object[]> findAllWithEstadoAndUser() {
        return tareaRepository.findAllWithEstadoAndUser();
    }
} 