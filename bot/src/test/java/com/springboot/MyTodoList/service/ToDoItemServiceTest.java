package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.repository.ToDoItemRepository;
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
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ToDoItemServiceTest {

    @Mock
    private ToDoItemRepository toDoItemRepository;

    @InjectMocks
    private ToDoItemService toDoItemService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void addToDoItem_ValidItem_ReturnsSavedItem() {
        // Arrange
        ToDoItem toDoItem = new ToDoItem();
        toDoItem.setDescription("Test Description");
        toDoItem.setCreation_ts(OffsetDateTime.now());

        when(toDoItemRepository.save(any(ToDoItem.class))).thenReturn(toDoItem);

        // Act
        ToDoItem savedItem = toDoItemService.addToDoItem(toDoItem);

        // Assert
        assertNotNull(savedItem);
        assertEquals("Test Description", savedItem.getDescription());
        verify(toDoItemRepository).save(toDoItem);
    }

    @Test
    void getItemById_ExistingItem_ReturnsItem() {
        // Arrange
        int itemId = 1;
        ToDoItem mockItem = new ToDoItem();
        mockItem.setID(itemId);
        mockItem.setDescription("Test Description");

        when(toDoItemRepository.findById(itemId)).thenReturn(Optional.of(mockItem));

        // Act
        ResponseEntity<ToDoItem> response = toDoItemService.getItemById(itemId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(itemId, response.getBody().getID());
        assertEquals("Test Description", response.getBody().getDescription());
    }

    @Test
    void getItemById_NonExistingItem_ReturnsNotFound() {
        // Arrange
        int itemId = 999;
        when(toDoItemRepository.findById(itemId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<ToDoItem> response = toDoItemService.getItemById(itemId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void findAll_ReturnsAllItems() {
        // Arrange
        ToDoItem item1 = new ToDoItem();
        item1.setID(1);
        item1.setDescription("Task 1");

        ToDoItem item2 = new ToDoItem();
        item2.setID(2);
        item2.setDescription("Task 2");

        when(toDoItemRepository.findAll()).thenReturn(Arrays.asList(item1, item2));

        // Act
        List<ToDoItem> items = toDoItemService.findAll();

        // Assert
        assertNotNull(items);
        assertEquals(2, items.size());
        assertEquals("Task 1", items.get(0).getDescription());
        assertEquals("Task 2", items.get(1).getDescription());
    }

    @Test
    void updateToDoItem_ValidItem_ReturnsUpdatedItem() {
        // Arrange
        int itemId = 1;
        ToDoItem existingItem = new ToDoItem();
        existingItem.setID(itemId);
        existingItem.setDescription("Original Description");

        ToDoItem updatedItem = new ToDoItem();
        updatedItem.setID(itemId);
        updatedItem.setDescription("Updated Description");
        updatedItem.setCreation_ts(OffsetDateTime.now());
        updatedItem.setDone(true);

        when(toDoItemRepository.findById(itemId)).thenReturn(Optional.of(existingItem));
        when(toDoItemRepository.save(any(ToDoItem.class))).thenReturn(updatedItem);

        // Act
        ToDoItem result = toDoItemService.updateToDoItem(itemId, updatedItem);

        // Assert
        assertNotNull(result);
        assertEquals(itemId, result.getID());
        assertEquals("Updated Description", result.getDescription());
        assertTrue(result.isDone());
        verify(toDoItemRepository).save(any(ToDoItem.class));
    }

    @Test
    void updateToDoItem_NonExistingItem_ReturnsNull() {
        // Arrange
        int itemId = 999;
        ToDoItem toDoItem = new ToDoItem();
        toDoItem.setID(itemId);
        toDoItem.setDescription("Updated Description");

        when(toDoItemRepository.findById(itemId)).thenReturn(Optional.empty());

        // Act
        ToDoItem result = toDoItemService.updateToDoItem(itemId, toDoItem);

        // Assert
        assertNull(result);
        verify(toDoItemRepository, never()).save(any(ToDoItem.class));
    }

    @Test
    void deleteToDoItem_ExistingItem_ReturnsTrue() {
        // Arrange
        int itemId = 1;
        doNothing().when(toDoItemRepository).deleteById(itemId);

        // Act
        boolean result = toDoItemService.deleteToDoItem(itemId);

        // Assert
        assertTrue(result);
        verify(toDoItemRepository).deleteById(itemId);
    }

    @Test
    void deleteToDoItem_NonExistingItem_ReturnsFalse() {
        // Arrange
        int itemId = 999;
        doThrow(new RuntimeException("Item not found")).when(toDoItemRepository).deleteById(itemId);

        // Act
        boolean result = toDoItemService.deleteToDoItem(itemId);

        // Assert
        assertFalse(result);
        verify(toDoItemRepository).deleteById(itemId);
    }
} 