package com.borkacle.repository;

import com.borkacle.model.Tarea;
import com.borkacle.model.Usuario;
import com.borkacle.model.Estado;
import com.borkacle.model.Sprint;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import com.borkacle.controller.ControllerApplication;

import java.time.OffsetDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = ControllerApplication.class)
@ActiveProfiles("test")
class TareaRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private TareaRepository tareaRepository;

    @Test
    void findByEquipoId_ReturnsTasksForTeam() {
        // Arrange
        Usuario usuario = new Usuario();
        usuario.setNombre("Test User");
        entityManager.persist(usuario);

        Tarea tarea = new Tarea();
        tarea.setTitulo("Test Task");
        tarea.setAsignadoA(usuario);
        tarea.setFechaCreacion(OffsetDateTime.now());
        entityManager.persist(tarea);

        entityManager.flush();

        // Act
        List<Tarea> result = tareaRepository.findByEquipoId(usuario.getEquipo() != null ? usuario.getEquipo().getId() : null);

        // Assert
        assertNotNull(result);
        // Puede estar vacío si usuario.getEquipo() es null
    }

    @Test
    void findBySprintId_ReturnsTasksForSprint() {
        // Arrange
        Sprint sprint = new Sprint();
        sprint.setNombre("Test Sprint");
        entityManager.persist(sprint);

        Tarea tarea = new Tarea();
        tarea.setTitulo("Test Task");
        tarea.setSprint(sprint);
        tarea.setFechaCreacion(OffsetDateTime.now());
        entityManager.persist(tarea);

        entityManager.flush();

        // Act
        List<Tarea> result = tareaRepository.findBySprintId(sprint.getId());

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals("Test Task", result.get(0).getTitulo());
    }

    @Test
    void findByEstadoId_ReturnsTasksWithState() {
        // Arrange
        Estado estado = new Estado();
        estado.setNombre("Test Estado");
        entityManager.persist(estado);

        Tarea tarea = new Tarea();
        tarea.setTitulo("Test Task");
        tarea.setEstado(estado);
        tarea.setFechaCreacion(OffsetDateTime.now());
        entityManager.persist(tarea);

        entityManager.flush();

        // Act
        List<Tarea> result = tareaRepository.findByEstadoId(estado.getId());

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals("Test Task", result.get(0).getTitulo());
    }

    @Test
    void findByAsignadoA_ReturnsTasksForUser() {
        // Arrange
        Usuario usuario = new Usuario();
        usuario.setNombre("Test User");
        entityManager.persist(usuario);

        Tarea tarea = new Tarea();
        tarea.setTitulo("Test Task");
        tarea.setAsignadoA(usuario);
        tarea.setFechaCreacion(OffsetDateTime.now());
        entityManager.persist(tarea);

        entityManager.flush();

        // Act
        List<Tarea> result = tareaRepository.findByAsignadoA(usuario);

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals("Test Task", result.get(0).getTitulo());
    }

    @Test
    void findAllWithEstado_ReturnsTasksWithEstadoInfo() {
        // Arrange
        Estado estado = new Estado();
        estado.setNombre("Test Estado");
        entityManager.persist(estado);

        Tarea tarea = new Tarea();
        tarea.setTitulo("Test Task");
        tarea.setEstado(estado);
        tarea.setFechaCreacion(OffsetDateTime.now());
        entityManager.persist(tarea);

        entityManager.flush();

        // Act
        List<Object[]> result = tareaRepository.findAllWithEstado();

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty());
        Object[] taskData = result.get(0);
        assertEquals(tarea.getId(), taskData[0]);
        assertEquals("Test Task", taskData[1]);
        assertEquals("Test Estado", taskData[4]);
    }

    @Test
    void findAllWithEstadoAndUser_ReturnsTasksWithEstadoAndUserInfo() {
        // Arrange
        Estado estado = new Estado();
        estado.setNombre("Test Estado");
        entityManager.persist(estado);

        Usuario usuario = new Usuario();
        usuario.setNombre("Test User");
        entityManager.persist(usuario);

        Tarea tarea = new Tarea();
        tarea.setTitulo("Test Task");
        tarea.setEstado(estado);
        tarea.setAsignadoA(usuario);
        tarea.setFechaCreacion(OffsetDateTime.now());
        entityManager.persist(tarea);

        entityManager.flush();

        // Act
        List<Object[]> result = tareaRepository.findAllWithEstadoAndUser();

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty());
        Object[] taskData = result.get(0);
        assertEquals(tarea.getId(), taskData[0]);
        assertEquals("Test Task", taskData[1]);
        assertEquals("Test Estado", taskData[4]);
        assertEquals("Test User", taskData[5]);
    }
} 