package com.borkacle.service;

import com.borkacle.model.*;
import com.borkacle.repository.TareaRepository;
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

class TareaServiceTest {

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

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createTarea_Success() {
        // Arrange
        String titulo = "Test Task";
        String descripcion = "Test Description";
        Double tiempoEstimado = 5.0;
        Long proyectoId = 1L;
        Long prioridadId = 1L;

        Estado estado = new Estado();
        estado.setId(1L);
        estado.setNombre("Pendiente");

        Prioridad prioridad = new Prioridad();
        prioridad.setId(1L);
        prioridad.setNombre("Alta");

        Tarea expectedTarea = new Tarea();
        expectedTarea.setId(1L);
        expectedTarea.setTitulo(titulo);
        expectedTarea.setDescripcion(descripcion);
        expectedTarea.setTiempoEstimado(tiempoEstimado);
        expectedTarea.setProyectoId(proyectoId);
        expectedTarea.setEstado(estado);
        expectedTarea.setPrioridad(prioridad);

        when(estadoService.findByNombre("Pendiente")).thenReturn(estado);
        when(prioridadService.findById(prioridadId)).thenReturn(prioridad);
        when(tareaRepository.save(any(Tarea.class))).thenReturn(expectedTarea);

        // Act
        Tarea result = tareaService.createTarea(titulo, descripcion, tiempoEstimado, proyectoId, prioridadId);

        // Assert
        assertNotNull(result);
        assertEquals(titulo, result.getTitulo());
        assertEquals(descripcion, result.getDescripcion());
        assertEquals(tiempoEstimado, result.getTiempoEstimado());
        assertEquals(proyectoId, result.getProyectoId());
        assertEquals(estado, result.getEstado());
        assertEquals(prioridad, result.getPrioridad());
        verify(tareaRepository).save(any(Tarea.class));
    }

    @Test
    void assignUser_Success() {
        // Arrange
        Long tareaId = 1L;
        Long usuarioId = 1L;

        Tarea tarea = new Tarea();
        tarea.setId(tareaId);
        tarea.setTitulo("Test Task");

        Usuario usuario = new Usuario();
        usuario.setId(usuarioId);
        usuario.setNombre("Test User");

        when(tareaRepository.findById(tareaId)).thenReturn(Optional.of(tarea));
        when(usuarioService.findById(usuarioId)).thenReturn(usuario);
        when(tareaRepository.save(any(Tarea.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        Tarea result = tareaService.assignUser(tareaId, usuarioId);

        // Assert
        assertNotNull(result);
        assertEquals(usuario, result.getAsignadoA());
        verify(tareaRepository).save(any(Tarea.class));
    }

    @Test
    void assignUser_TaskNotFound_ThrowsException() {
        // Arrange
        Long tareaId = 999L;
        Long usuarioId = 1L;

        when(tareaRepository.findById(tareaId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> tareaService.assignUser(tareaId, usuarioId));
        verify(tareaRepository, never()).save(any(Tarea.class));
    }

    @Test
    void completeTask_Success() {
        // Arrange
        Long tareaId = 1L;
        Double tiempoReal = 6.0;

        Tarea tarea = new Tarea();
        tarea.setId(tareaId);
        tarea.setTitulo("Test Task");

        Estado estadoCompletado = new Estado();
        estadoCompletado.setId(2L);
        estadoCompletado.setNombre("Completado");

        when(tareaRepository.findById(tareaId)).thenReturn(Optional.of(tarea));
        when(estadoService.findByNombre("Completado")).thenReturn(estadoCompletado);
        when(tareaRepository.save(any(Tarea.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        Tarea result = tareaService.completeTask(tareaId, tiempoReal);

        // Assert
        assertNotNull(result);
        assertEquals(tiempoReal, result.getTiempoReal());
        assertEquals(estadoCompletado, result.getEstado());
        verify(tareaRepository).save(any(Tarea.class));
    }

    @Test
    void updateTask_Success() {
        // Arrange
        Long tareaId = 1L;
        String newTitulo = "Updated Task";
        String newDescripcion = "Updated Description";
        Double newTiempoEstimado = 8.0;
        Long newEstadoId = 2L;
        Long newPrioridadId = 2L;

        Tarea existingTarea = new Tarea();
        existingTarea.setId(tareaId);
        existingTarea.setTitulo("Original Task");

        Estado newEstado = new Estado();
        newEstado.setId(newEstadoId);
        newEstado.setNombre("En Progreso");

        Prioridad newPrioridad = new Prioridad();
        newPrioridad.setId(newPrioridadId);
        newPrioridad.setNombre("Media");

        when(tareaRepository.findById(tareaId)).thenReturn(Optional.of(existingTarea));
        when(estadoService.findById(newEstadoId)).thenReturn(newEstado);
        when(prioridadService.findById(newPrioridadId)).thenReturn(newPrioridad);
        when(tareaRepository.save(any(Tarea.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        Tarea result = tareaService.updateTask(
            tareaId, newTitulo, newDescripcion, newTiempoEstimado,
            newEstadoId, newPrioridadId, null, null, null
        );

        // Assert
        assertNotNull(result);
        assertEquals(newTitulo, result.getTitulo());
        assertEquals(newDescripcion, result.getDescripcion());
        assertEquals(newTiempoEstimado, result.getTiempoEstimado());
        assertEquals(newEstado, result.getEstado());
        assertEquals(newPrioridad, result.getPrioridad());
        verify(tareaRepository).save(any(Tarea.class));
    }

    @Test
    void findAll_ReturnsAllTasks() {
        // Arrange
        Tarea task1 = new Tarea();
        task1.setId(1L);
        task1.setTitulo("Task 1");

        Tarea task2 = new Tarea();
        task2.setId(2L);
        task2.setTitulo("Task 2");

        when(tareaRepository.findAll()).thenReturn(Arrays.asList(task1, task2));

        // Act
        List<Tarea> result = tareaService.findAll();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Task 1", result.get(0).getTitulo());
        assertEquals("Task 2", result.get(1).getTitulo());
    }
} 