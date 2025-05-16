package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.*;
import com.springboot.MyTodoList.repository.TareaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class TareaServiceTest {

    @Mock
    private TareaRepository tareaRepository;

    @Mock
    private EstadoService estadoService;

    @Mock
    private PrioridadService prioridadService;

    @Mock
    private SprintService sprintService;

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private TareaService tareaService;

    private Tarea tarea;
    private Usuario usuario;
    private Estado estadoPendiente;
    private Estado estadoCompletado;
    private Prioridad prioridadMedia;
    private Sprint sprint;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Setup test data
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Test User");

        estadoPendiente = new Estado();
        estadoPendiente.setId(1L);
        estadoPendiente.setNombre("Pendiente");

        estadoCompletado = new Estado();
        estadoCompletado.setId(2L);
        estadoCompletado.setNombre("Completado");

        prioridadMedia = new Prioridad();
        prioridadMedia.setId(1L);
        prioridadMedia.setNombre("Media");

        sprint = new Sprint();
        sprint.setId(1L);
        sprint.setNombre("Sprint 1");

        tarea = new Tarea();
        tarea.setId(1L);
        tarea.setTitulo("Test Task");
        tarea.setDescripcion("Test Description");
        tarea.setEstado(estadoPendiente);
        tarea.setPrioridad(prioridadMedia);
        tarea.setAsignadoA(usuario);
        tarea.setSprint(sprint);
        tarea.setFechaCreacion(OffsetDateTime.now());
        tarea.setFechaActualizacion(OffsetDateTime.now());
    }

    @Test
    void createTarea_ValidRequest_ReturnsCreatedTarea() {
        when(estadoService.findByNombre("Pendiente")).thenReturn(estadoPendiente);
        when(prioridadService.findById(1L)).thenReturn(prioridadMedia);
        Tarea tareaMock = new Tarea();
        tareaMock.setId(1L);
        tareaMock.setTitulo("Nueva Tarea");
        tareaMock.setDescripcion("Descripción de la nueva tarea");
        tareaMock.setEstado(estadoPendiente);
        tareaMock.setPrioridad(prioridadMedia);
        tareaMock.setProyectoId(1L);
        when(tareaRepository.save(any(Tarea.class))).thenReturn(tareaMock);
        Tarea result = tareaService.createTarea("Nueva Tarea", "Descripción de la nueva tarea", 5.0, 1L, 1L);
        assertNotNull(result);
        assertEquals("Nueva Tarea", result.getTitulo());
        assertEquals(estadoPendiente, result.getEstado());
        assertEquals(prioridadMedia, result.getPrioridad());
        verify(tareaRepository).save(any(Tarea.class));
    }

    @Test
    void assignUser_ValidRequest_ReturnsUpdatedTarea() {
        // Arrange
        when(tareaRepository.findById(1L)).thenReturn(Optional.of(tarea));
        when(usuarioService.findById(1L)).thenReturn(usuario);
        when(tareaRepository.save(any(Tarea.class))).thenReturn(tarea);

        // Act
        Tarea result = tareaService.assignUser(1L, 1L);

        // Assert
        assertNotNull(result);
        assertEquals(usuario, result.getAsignadoA());
        verify(tareaRepository).save(any(Tarea.class));
    }

    @Test
    void assignUser_NonExistingTarea_ReturnsNull() {
        // Arrange
        when(tareaRepository.findById(1L)).thenReturn(Optional.empty());

        // Act
        Tarea result = tareaService.assignUser(1L, 1L);

        // Assert
        assertNull(result);
        verify(tareaRepository, never()).save(any(Tarea.class));
    }

    @Test
    void assignUser_NonExistingUsuario_ReturnsNull() {
        // Arrange
        when(tareaRepository.findById(1L)).thenReturn(Optional.of(tarea));
        when(usuarioService.findById(1L)).thenReturn(null);

        // Act
        Tarea result = tareaService.assignUser(1L, 1L);

        // Assert
        assertNull(result);
        verify(tareaRepository, never()).save(any(Tarea.class));
    }

    @Test
    void updateTask_ValidRequest_ReturnsUpdatedTarea() {
        // Arrange
        when(tareaRepository.findById(1L)).thenReturn(Optional.of(tarea));
        when(estadoService.findById(1L)).thenReturn(estadoPendiente);
        when(prioridadService.findById(1L)).thenReturn(prioridadMedia);
        when(sprintService.findById(1L)).thenReturn(sprint);
        when(tareaRepository.save(any(Tarea.class))).thenReturn(tarea);

        // Act
        Tarea result = tareaService.updateTask(1L, "Updated Task", "Updated Description", 10.0, 1L, 1L, 1L, 1L, 8.0);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Task", result.getTitulo());
        assertEquals("Updated Description", result.getDescripcion());
        assertEquals(estadoPendiente, result.getEstado());
        assertEquals(prioridadMedia, result.getPrioridad());
        assertEquals(sprint, result.getSprint());
        verify(tareaRepository).save(any(Tarea.class));
    }

    @Test
    void updateTask_NonExistingTarea_ReturnsNull() {
        // Arrange
        when(tareaRepository.findById(1L)).thenReturn(Optional.empty());

        // Act
        Tarea result = tareaService.updateTask(1L, "Updated Task", "Updated Description", 10.0, 1L, 1L, 1L, 1L, 8.0);

        // Assert
        assertNull(result);
        verify(tareaRepository, never()).save(any(Tarea.class));
    }

    @Test
    void findAll_ReturnsAllTareas() {
        // Arrange
        List<Tarea> tareas = Arrays.asList(tarea);
        when(tareaRepository.findAll()).thenReturn(tareas);

        // Act
        List<Tarea> result = tareaService.findAll();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(tarea, result.get(0));
    }

    @Test
    void getTareasByUsuario_ReturnsUserTareas() {
        // Arrange
        List<Tarea> tareas = Arrays.asList(tarea);
        when(tareaRepository.findByAsignadoA(usuario)).thenReturn(tareas);

        // Act
        List<Tarea> result = tareaService.getTareasByUsuario(usuario);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(tarea, result.get(0));
    }

    @Test
    void getTareasBySprint_ReturnsSprintTareas() {
        // Arrange
        List<Tarea> tareas = Arrays.asList(tarea);
        when(tareaRepository.findBySprintId(1L)).thenReturn(tareas);

        // Act
        List<Tarea> result = tareaService.getTareasBySprint(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(tarea, result.get(0));
    }

    @Test
    void getTareasByEstado_ReturnsEstadoTareas() {
        // Arrange
        List<Tarea> tareas = Arrays.asList(tarea);
        when(estadoService.findByNombre("Pendiente")).thenReturn(estadoPendiente);
        when(tareaRepository.findByEstadoId(1L)).thenReturn(tareas);

        // Act
        List<Tarea> result = tareaService.getTareasByEstado("Pendiente");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(tarea, result.get(0));
    }

    @Test
    void getTareasCompletadasBySprint_ReturnsCompletedTareas() {
        List<Tarea> tareas = Arrays.asList(
            buildTarea(1L, "Tarea 1", estadoCompletado, prioridadMedia, usuario, sprint),
            buildTarea(2L, "Tarea 2", estadoPendiente, prioridadMedia, usuario, sprint)
        );
        when(tareaRepository.findBySprintId(1L)).thenReturn(tareas);
        when(estadoService.findByNombre("Completado")).thenReturn(estadoCompletado);
        List<Tarea> result = tareaService.getTareasBySprint(1L);
        // Filtrar completadas
        List<Tarea> completadas = result.stream().filter(t -> t.getEstado().getNombre().equals("Completado")).toList();
        assertEquals(1, completadas.size());
        assertEquals("Tarea 1", completadas.get(0).getTitulo());
        verify(tareaRepository).findBySprintId(1L);
    }

    @Test
    void getTareasCompletadasByUsuarioAndSprint_ReturnsCompletedTareas() {
        List<Tarea> tareas = Arrays.asList(
            buildTarea(1L, "Tarea 1", estadoCompletado, prioridadMedia, usuario, sprint),
            buildTarea(2L, "Tarea 2", estadoPendiente, prioridadMedia, usuario, sprint)
        );
        when(tareaRepository.findByAsignadoA(usuario)).thenReturn(tareas);
        when(estadoService.findByNombre("Completado")).thenReturn(estadoCompletado);
        List<Tarea> result = tareaService.getTareasByUsuario(usuario);
        // Filtrar por sprint y completadas
        List<Tarea> completadas = result.stream()
            .filter(t -> t.getSprint() != null && t.getSprint().getId().equals(1L))
            .filter(t -> t.getEstado().getNombre().equals("Completado"))
            .toList();
        assertEquals(1, completadas.size());
        assertEquals("Tarea 1", completadas.get(0).getTitulo());
        verify(tareaRepository).findByAsignadoA(usuario);
    }

    // Utilidad para crear tareas de prueba
    private Tarea buildTarea(Long id, String titulo, Estado estado, Prioridad prioridad, Usuario usuario, Sprint sprint) {
        Tarea tarea = new Tarea();
        tarea.setId(id);
        tarea.setTitulo(titulo);
        tarea.setEstado(estado);
        tarea.setPrioridad(prioridad);
        tarea.setAsignadoA(usuario);
        tarea.setSprint(sprint);
        return tarea;
    }
} 