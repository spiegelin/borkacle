package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.*;
import com.springboot.MyTodoList.repository.TareaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.OffsetDateTime;
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
    private Estado estado;
    private Prioridad prioridad;
    private Sprint sprint;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Setup test data
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Test User");

        estado = new Estado();
        estado.setId(1L);
        estado.setNombre("Pendiente");

        prioridad = new Prioridad();
        prioridad.setId(1L);
        prioridad.setNombre("Alta");

        sprint = new Sprint();
        sprint.setId(1L);
        sprint.setNombre("Sprint 1");

        tarea = new Tarea();
        tarea.setId(1L);
        tarea.setTitulo("Test Task");
        tarea.setDescripcion("Test Description");
        tarea.setEstado(estado);
        tarea.setPrioridad(prioridad);
        tarea.setAsignadoA(usuario);
        tarea.setSprint(sprint);
        tarea.setFechaCreacion(OffsetDateTime.now());
        tarea.setFechaActualizacion(OffsetDateTime.now());
    }

    @Test
    void createTarea_ValidRequest_ReturnsCreatedTarea() {
        // Arrange
        when(estadoService.findByNombre("Pendiente")).thenReturn(estado);
        when(prioridadService.findById(1L)).thenReturn(prioridad);
        when(tareaRepository.save(any(Tarea.class))).thenReturn(tarea);

        // Act
        Tarea result = tareaService.createTarea("Test Task", "Test Description", 5.0, 1L, 1L);

        // Assert
        assertNotNull(result);
        assertEquals("Test Task", result.getTitulo());
        assertEquals("Test Description", result.getDescripcion());
        assertEquals(estado, result.getEstado());
        assertEquals(prioridad, result.getPrioridad());
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
        when(estadoService.findById(1L)).thenReturn(estado);
        when(prioridadService.findById(1L)).thenReturn(prioridad);
        when(sprintService.findById(1L)).thenReturn(sprint);
        when(tareaRepository.save(any(Tarea.class))).thenReturn(tarea);

        // Act
        Tarea result = tareaService.updateTask(1L, "Updated Task", "Updated Description", 10.0, 1L, 1L, 1L, 1L, 8.0);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Task", result.getTitulo());
        assertEquals("Updated Description", result.getDescripcion());
        assertEquals(estado, result.getEstado());
        assertEquals(prioridad, result.getPrioridad());
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
        when(estadoService.findByNombre("Pendiente")).thenReturn(estado);
        when(tareaRepository.findByEstadoId(1L)).thenReturn(tareas);

        // Act
        List<Tarea> result = tareaService.getTareasByEstado("Pendiente");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(tarea, result.get(0));
    }
} 