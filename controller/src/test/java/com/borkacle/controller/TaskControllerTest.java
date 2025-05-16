package com.borkacle.controller;

import com.borkacle.model.Tarea;
import com.borkacle.service.TareaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TaskControllerTest {

    @Mock
    private TareaService tareaService;

    @InjectMocks
    private TaskController taskController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void addTask_ValidRequest_ReturnsCreatedTask() {
        // Arrange
        TaskController.CreateTaskRequest request = new TaskController.CreateTaskRequest();
        request.titulo = "Test Task";
        request.descripcion = "Test Description";
        request.tiempoEstimado = 5.0;
        request.proyectoId = 1L;
        request.prioridadId = 1L;

        Tarea mockTarea = new Tarea();
        mockTarea.setId(1L);
        mockTarea.setTitulo(request.titulo);
        mockTarea.setDescripcion(request.descripcion);
        mockTarea.setTiempoEstimado(request.tiempoEstimado);

        when(tareaService.createTarea(
            anyString(),
            anyString(),
            anyDouble(),
            anyLong(),
            anyLong()
        )).thenReturn(mockTarea);

        // Act
        ResponseEntity<Tarea> response = taskController.addTask(request);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(request.titulo, response.getBody().getTitulo());
        verify(tareaService).createTarea(
            request.titulo,
            request.descripcion,
            request.tiempoEstimado,
            request.proyectoId,
            request.prioridadId
        );
    }

    @Test
    void addTask_InvalidRequest_ReturnsBadRequest() {
        // Arrange
        TaskController.CreateTaskRequest request = new TaskController.CreateTaskRequest();
        // Missing required title

        // Act
        ResponseEntity<Tarea> response = taskController.addTask(request);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(tareaService, never()).createTarea(any(), any(), any(), any(), any());
    }

    @Test
    void getTaskById_ExistingTask_ReturnsTask() {
        // Arrange
        Long taskId = 1L;
        Tarea mockTarea = new Tarea();
        mockTarea.setId(taskId);
        mockTarea.setTitulo("Test Task");
        mockTarea.setFechaCreacion(OffsetDateTime.now());

        when(tareaService.findById(taskId)).thenReturn(Optional.of(mockTarea));

        // Act
        ResponseEntity<TaskController.TaskDetailDto> response = taskController.getTaskById(taskId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(taskId, response.getBody().id);
        assertEquals("Test Task", response.getBody().titulo);
    }

    @Test
    void getTaskById_NonExistingTask_ReturnsNotFound() {
        // Arrange
        Long taskId = 999L;
        when(tareaService.findById(taskId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<TaskController.TaskDetailDto> response = taskController.getTaskById(taskId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void getAllTasks_ReturnsListOfTasks() {
        // Arrange
        Tarea task1 = new Tarea();
        task1.setId(1L);
        task1.setTitulo("Task 1");
        task1.setFechaCreacion(OffsetDateTime.now());

        Tarea task2 = new Tarea();
        task2.setId(2L);
        task2.setTitulo("Task 2");
        task2.setFechaCreacion(OffsetDateTime.now());

        when(tareaService.findAll()).thenReturn(Arrays.asList(task1, task2));

        // Act
        ResponseEntity<List<TaskController.TaskSummaryListDto>> response = taskController.getAllTasks();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        assertEquals("Task 1", response.getBody().get(0).titulo);
        assertEquals("Task 2", response.getBody().get(1).titulo);
    }

    @Test
    void assignUserToTask_ValidRequest_ReturnsUpdatedTask() {
        // Arrange
        Long taskId = 1L;
        Long userId = 1L;
        Map<String, Long> payload = Map.of("userId", userId);

        Tarea mockTarea = new Tarea();
        mockTarea.setId(taskId);
        mockTarea.setTitulo("Test Task");

        when(tareaService.assignUser(taskId, userId)).thenReturn(mockTarea);

        // Act
        ResponseEntity<Tarea> response = taskController.assignUserToTask(taskId, payload);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(taskId, response.getBody().getId());
        verify(tareaService).assignUser(taskId, userId);
    }

    @Test
    void assignUserToTask_InvalidRequest_ReturnsBadRequest() {
        // Arrange
        Long taskId = 1L;
        Map<String, Long> payload = Map.of(); // Empty payload

        // Act
        ResponseEntity<Tarea> response = taskController.assignUserToTask(taskId, payload);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(tareaService, never()).assignUser(any(), any());
    }
} 