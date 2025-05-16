package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.service.ToDoItemService;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ToDoItemControllerTest {

    @Mock
    private ToDoItemService toDoItemService;

    @InjectMocks
    private ToDoItemController toDoItemController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void addToDoItem_ValidRequest_ReturnsCreatedItem() throws Exception {
        // Arrange
        ToDoItem toDoItem = new ToDoItem();
        toDoItem.setDescription("Test Description");
        toDoItem.setCreation_ts(OffsetDateTime.now());

        when(toDoItemService.addToDoItem(any(ToDoItem.class))).thenReturn(toDoItem);

        // Act
        ResponseEntity response = toDoItemController.addToDoItem(toDoItem);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(toDoItemService).addToDoItem(toDoItem);
    }

    @Test
    void getToDoItemById_ExistingItem_ReturnsItem() {
        // Arrange
        int itemId = 1;
        ToDoItem mockItem = new ToDoItem();
        mockItem.setID(itemId);
        mockItem.setDescription("Test Description");

        when(toDoItemService.getItemById(itemId)).thenReturn(new ResponseEntity<>(mockItem, HttpStatus.OK));

        // Act
        ResponseEntity<ToDoItem> response = toDoItemController.getToDoItemById(itemId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(itemId, response.getBody().getID());
        assertEquals("Test Description", response.getBody().getDescription());
    }

    @Test
    void getToDoItemById_NonExistingItem_ReturnsNotFound() {
        // Arrange
        int itemId = 999;
        when(toDoItemService.getItemById(itemId)).thenReturn(new ResponseEntity<>(HttpStatus.NOT_FOUND));

        // Act
        ResponseEntity<ToDoItem> response = toDoItemController.getToDoItemById(itemId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void getAllToDoItems_ReturnsListOfItems() {
        // Arrange
        ToDoItem item1 = new ToDoItem();
        item1.setID(1);
        item1.setDescription("Task 1");

        ToDoItem item2 = new ToDoItem();
        item2.setID(2);
        item2.setDescription("Task 2");

        when(toDoItemService.findAll()).thenReturn(Arrays.asList(item1, item2));

        // Act
        List<ToDoItem> items = toDoItemController.getAllToDoItems();

        // Assert
        assertNotNull(items);
        assertEquals(2, items.size());
        assertEquals("Task 1", items.get(0).getDescription());
        assertEquals("Task 2", items.get(1).getDescription());
    }

    @Test
    void updateToDoItem_ValidRequest_ReturnsUpdatedItem() {
        // Arrange
        int itemId = 1;
        ToDoItem toDoItem = new ToDoItem();
        toDoItem.setID(itemId);
        toDoItem.setDescription("Updated Description");

        when(toDoItemService.updateToDoItem(anyInt(), any(ToDoItem.class))).thenReturn(toDoItem);

        // Act
        ResponseEntity response = toDoItemController.updateToDoItem(toDoItem, itemId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(toDoItemService).updateToDoItem(itemId, toDoItem);
    }

    @Test
    void updateToDoItem_NonExistingItem_ReturnsNotFound() {
        // Arrange
        int itemId = 999;
        ToDoItem toDoItem = new ToDoItem();
        toDoItem.setID(itemId);
        toDoItem.setDescription("Updated Description");

        when(toDoItemService.updateToDoItem(anyInt(), any(ToDoItem.class))).thenReturn(null);

        // Act
        ResponseEntity response = toDoItemController.updateToDoItem(toDoItem, itemId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void deleteToDoItem_ExistingItem_ReturnsOk() {
        // Arrange
        int itemId = 1;
        when(toDoItemService.deleteToDoItem(itemId)).thenReturn(true);

        // Act
        ResponseEntity<Boolean> response = toDoItemController.deleteToDoItem(itemId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody());
        verify(toDoItemService).deleteToDoItem(itemId);
    }

    @Test
    void deleteToDoItem_NonExistingItem_ReturnsNotFound() {
        // Arrange
        int itemId = 999;
        when(toDoItemService.deleteToDoItem(itemId)).thenReturn(false);

        // Act
        ResponseEntity<Boolean> response = toDoItemController.deleteToDoItem(itemId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertFalse(response.getBody());
        verify(toDoItemService).deleteToDoItem(itemId);
    }
} 