package com.springboot.MyTodoList.controller;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardRemove;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import com.springboot.MyTodoList.model.*;
import com.springboot.MyTodoList.service.*;
import com.springboot.MyTodoList.util.*;

public class ToDoItemBotController extends TelegramLongPollingBot {

	private static final Logger logger = LoggerFactory.getLogger(ToDoItemBotController.class);
	
	@Autowired
	private UsuarioService usuarioService;
	
	@Autowired
	private TareaService tareaService;
	
	@Autowired
	private SprintService sprintService;
	
	@Autowired
	private PrioridadService prioridadService;
	
	@Autowired
	private EstadoService estadoService;

	private String botToken;
	private String botName;

	public ToDoItemBotController(String botToken, String botName) {
		super(botToken);
		this.botToken = botToken;
		this.botName = botName;
	}

	@Override
	public void onUpdateReceived(Update update) {
		if (update.hasMessage() && update.getMessage().hasText()) {
			long chatId = update.getMessage().getChatId();
			String messageText = update.getMessage().getText();

			if (messageText.equals("/start")) {
				showMainMenu(chatId);
			} else if (messageText.equals("❓ Help")) {
				sendMessage(chatId, BotMessages.HELP_MESSAGE.getMessage());
			} else if (messageText.equals("➕ Add Task")) {
				sendMessage(chatId, "Please provide task details in the following format:\n" +
								  "Title: [task title]\n" +
								  "Description: [task description] (optional)\n" +
								  "Estimated Time: [hours]\n" +
								  "Project ID: [project id]\n" +
								  "Type: [Bug/Feature/Improvement]\n" +
								  "Priority ID: [priority id] (optional)");
			} else if (messageText.equals("📋 List Tasks")) {
				showAllTasks(chatId);
			} else if (messageText.equals("👥 Assign User")) {
				sendMessage(chatId, "Please provide assignment details:\n" +
								  "Task ID: [task id]\n" +
								  "User ID: [user id]");
			} else if (messageText.equals("📅 Assign Sprint")) {
				sendMessage(chatId, "Please provide sprint assignment details:\n" +
								  "Task ID: [task id]\n" +
								  "Sprint ID: [sprint id]");
			} else if (messageText.equals("✅ Complete Task")) {
				sendMessage(chatId, "Please provide completion details:\n" +
								  "Task ID: [task id]\n" +
								  "Actual Time: [hours]");
			} else if (messageText.equals("✏️ Edit Task")) {
				sendMessage(chatId, "Please provide task details to update (only include fields you want to change):\n" +
								  "Task ID: [task id]\n" +
								  "Title: [new title]\n" +
								  "Description: [new description]\n" +
								  "Estimated Time: [new hours]\n" +
								  "Estado ID: [new estado id]\n" +
								  "Priority ID: [new priority id]\n" +
								  "Project ID: [new project id]\n" +
								  "Sprint ID: [new sprint id]\n" +
								  "Actual Time: [new hours]\n" +
								  "Type: [new type]");
			} else if (messageText.equals("📊 Show Sprint")) {
				showCurrentSprintTasks(chatId);
			} else if (messageText.equals("❌ Hide")) {
				hideKeyboard(chatId);
			} else {
				// Handle task creation based on message format
				if (messageText.contains("Title:") && messageText.contains("Estimated Time:") && 
					messageText.contains("Project ID:") && messageText.contains("Type:")) {
					handleTaskCreation(chatId, messageText);
				} else if (messageText.contains("Task ID:") && messageText.contains("User ID:")) {
					handleUserAssignment(chatId, messageText);
				} else if (messageText.contains("Task ID:") && messageText.contains("Sprint ID:")) {
					handleSprintAssignment(chatId, messageText);
				} else if (messageText.contains("Task ID:") && messageText.contains("Actual Time:")) {
					handleTaskCompletion(chatId, messageText);
				} else if (messageText.contains("Task ID:") && (messageText.contains("Title:") || 
					messageText.contains("Description:") || messageText.contains("Estimated Time:") ||
					messageText.contains("Estado ID:") || messageText.contains("Priority ID:") ||
					messageText.contains("Project ID:") || messageText.contains("Sprint ID:") ||
					messageText.contains("Actual Time:") || messageText.contains("Type:"))) {
					handleTaskUpdate(chatId, messageText);
				}
			}
		}
	}

	private void showMainMenu(long chatId) {
		SendMessage message = new SendMessage();
		message.setChatId(chatId);
		message.setText("Welcome to the Task Management Bot! Please select an option:");

		// Create keyboard
		ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
		List<KeyboardRow> keyboard = new ArrayList<>();

		// First row
		KeyboardRow row1 = new KeyboardRow();
		row1.add("➕ Add Task");
		row1.add("📋 List Tasks");
		keyboard.add(row1);

		// Second row
		KeyboardRow row2 = new KeyboardRow();
		row2.add("👥 Assign User");
		row2.add("📅 Assign Sprint");
		keyboard.add(row2);

		// Third row
		KeyboardRow row3 = new KeyboardRow();
		row3.add("✅ Complete Task");
		row3.add("✏️ Edit Task");
		keyboard.add(row3);

		// Fourth row
		KeyboardRow row4 = new KeyboardRow();
		row4.add("📊 Show Sprint");
		row4.add("❓ Help");
		keyboard.add(row4);

		// Fifth row
		KeyboardRow row5 = new KeyboardRow();
		row5.add("❌ Hide");
		keyboard.add(row5);

		// Configure keyboard
		keyboardMarkup.setKeyboard(keyboard);
		keyboardMarkup.setResizeKeyboard(true);
		keyboardMarkup.setOneTimeKeyboard(false);
		keyboardMarkup.setSelective(true);
		message.setReplyMarkup(keyboardMarkup);

		try {
			execute(message);
			logger.info("Main menu keyboard sent to chat {}", chatId);
		} catch (TelegramApiException e) {
			logger.error("Error showing main menu: " + e.getMessage(), e);
		}
	}

	private void hideKeyboard(long chatId) {
		SendMessage message = new SendMessage();
		message.setChatId(chatId);
		message.setText("Keyboard hidden. Use /start to show it again.");
		message.setReplyMarkup(new ReplyKeyboardMarkup());
		try {
			execute(message);
		} catch (TelegramApiException e) {
			logger.error("Error hiding keyboard: " + e.getMessage(), e);
		}
	}

	private void sendMessage(long chatId, String text) {
		SendMessage message = new SendMessage();
		message.setChatId(chatId);
		message.setText(text);
		try {
			execute(message);
		} catch (TelegramApiException e) {
			logger.error("Error sending message: " + e.getMessage(), e);
		}
	}

	private String extractValue(String message, String field) {
		int startIndex = message.indexOf(field) + field.length();
		int endIndex = message.indexOf("\n", startIndex);
		if (endIndex == -1) {
			endIndex = message.length();
		}
		return message.substring(startIndex, endIndex).trim();
	}

	private void handleTaskCreation(long chatId, String messageText) {
		try {
			// Parse task details from message
			String title = extractValue(messageText, "Title:");
			String description = extractValue(messageText, "Description:");
			Double estimatedTime = Double.parseDouble(extractValue(messageText, "Estimated Time:"));
			Long proyectoId = Long.parseLong(extractValue(messageText, "Project ID:"));
			String tipo = extractValue(messageText, "Type:");
			Long prioridadId = null;
			
			try {
				String prioridadIdStr = extractValue(messageText, "Priority ID:");
				if (!prioridadIdStr.isEmpty()) {
					prioridadId = Long.parseLong(prioridadIdStr);
				}
			} catch (NumberFormatException e) {
				sendMessage(chatId, "Error: Priority ID must be a valid number.");
				return;
			}

			// Validate estimated time
			if (estimatedTime > 4.0) {
				sendMessage(chatId, "Error: Estimated time cannot exceed 4 hours. Please break down the task into smaller subtasks.");
				return;
			}

			// Create task
			Tarea tarea = tareaService.createTarea(title, description, estimatedTime, proyectoId, tipo, prioridadId);

			if (tarea != null) {
				sendMessage(chatId, "Task created successfully!\nID: " + tarea.getId());
			} else {
				sendMessage(chatId, "Error creating task. Please try again.");
			}
		} catch (NumberFormatException e) {
			sendMessage(chatId, "Error: Please ensure all numeric fields (Estimated Time, Project ID) are valid numbers.");
		} catch (Exception e) {
			logger.error("Error creating task: " + e.getMessage(), e);
			sendMessage(chatId, "Error creating task: " + e.getMessage());
		}
	}

	private void handleUserAssignment(long chatId, String messageText) {
		try {
			Long taskId = Long.parseLong(extractValue(messageText, "Task ID:"));
			Long userId = Long.parseLong(extractValue(messageText, "User ID:"));

			// First assign the user
			Tarea tarea = tareaService.assignUser(taskId, userId);
			if (tarea != null) {
				// Then update the task's estado_id to 1
				tarea = tareaService.updateTask(taskId, null, null, null, 1L, null, null, null, null, null);
				if (tarea != null) {
					sendMessage(chatId, "User assigned successfully to task " + taskId + " and task status updated to 'In Progress'");
				} else {
					sendMessage(chatId, "Error updating task status. User was assigned but status update failed.");
				}
			} else {
				sendMessage(chatId, "Error assigning user. Task or user not found.");
			}
		} catch (NumberFormatException e) {
			sendMessage(chatId, "Error: Please ensure Task ID and User ID are valid numbers.");
		} catch (Exception e) {
			logger.error("Error assigning user: " + e.getMessage(), e);
			sendMessage(chatId, "Error assigning user: " + e.getMessage());
		}
	}

	private void handleSprintAssignment(long chatId, String messageText) {
		try {
			Long taskId = Long.parseLong(extractValue(messageText, "Task ID:"));
			Long sprintId = Long.parseLong(extractValue(messageText, "Sprint ID:"));

			Tarea tarea = tareaService.assignSprint(taskId, sprintId);
			if (tarea != null) {
				sendMessage(chatId, "Sprint assigned successfully to task " + taskId);
			} else {
				sendMessage(chatId, "Error assigning sprint. Task or sprint not found.");
			}
		} catch (NumberFormatException e) {
			sendMessage(chatId, "Error: Please ensure Task ID and Sprint ID are valid numbers.");
		} catch (Exception e) {
			logger.error("Error assigning sprint: " + e.getMessage(), e);
			sendMessage(chatId, "Error assigning sprint: " + e.getMessage());
		}
	}

	private void handleTaskCompletion(long chatId, String messageText) {
		try {
			Long taskId = Long.parseLong(extractValue(messageText, "Task ID:"));
			Double actualTime = Double.parseDouble(extractValue(messageText, "Actual Time:"));

			Tarea tarea = tareaService.completeTask(taskId, actualTime);
			if (tarea != null) {
				sendMessage(chatId, "Task " + taskId + " marked as completed!");
			} else {
				sendMessage(chatId, "Error completing task. Task not found.");
			}
		} catch (NumberFormatException e) {
			sendMessage(chatId, "Error: Please ensure Task ID and Actual Time are valid numbers.");
		} catch (Exception e) {
			logger.error("Error completing task: " + e.getMessage(), e);
			sendMessage(chatId, "Error completing task: " + e.getMessage());
		}
	}

	private void handleTaskUpdate(long chatId, String messageText) {
		try {
			// Task ID is mandatory
			Long taskId = Long.parseLong(extractValue(messageText, "Task ID:"));
			
			// Initialize all fields as null
			String titulo = null;
			String descripcion = null;
			Double tiempoEstimado = null;
			Long estadoId = null;
			Long prioridadId = null;
			Long proyectoId = null;
			Long sprintId = null;
			Double tiempoReal = null;
			String tipo = null;

			// Only parse fields that are present in the message
			if (messageText.contains("Title:")) {
				titulo = extractValue(messageText, "Title:");
			}
			if (messageText.contains("Description:")) {
				descripcion = extractValue(messageText, "Description:");
			}
			if (messageText.contains("Estimated Time:")) {
				try {
					String tiempoEstimadoStr = extractValue(messageText, "Estimated Time:");
					if (!tiempoEstimadoStr.isEmpty()) {
						tiempoEstimado = Double.parseDouble(tiempoEstimadoStr);
					}
				} catch (NumberFormatException e) {
					sendMessage(chatId, "Error: Estimated Time must be a valid number.");
					return;
				}
			}
			if (messageText.contains("Estado ID:")) {
				try {
					String estadoIdStr = extractValue(messageText, "Estado ID:");
					if (!estadoIdStr.isEmpty()) {
						estadoId = Long.parseLong(estadoIdStr);
					}
				} catch (NumberFormatException e) {
					sendMessage(chatId, "Error: Estado ID must be a valid number.");
					return;
				}
			}
			if (messageText.contains("Priority ID:")) {
				try {
					String prioridadIdStr = extractValue(messageText, "Priority ID:");
					if (!prioridadIdStr.isEmpty()) {
						prioridadId = Long.parseLong(prioridadIdStr);
					}
				} catch (NumberFormatException e) {
					sendMessage(chatId, "Error: Priority ID must be a valid number.");
					return;
				}
			}
			if (messageText.contains("Project ID:")) {
				try {
					String proyectoIdStr = extractValue(messageText, "Project ID:");
					if (!proyectoIdStr.isEmpty()) {
						proyectoId = Long.parseLong(proyectoIdStr);
					}
				} catch (NumberFormatException e) {
					sendMessage(chatId, "Error: Project ID must be a valid number.");
					return;
				}
			}
			if (messageText.contains("Sprint ID:")) {
				try {
					String sprintIdStr = extractValue(messageText, "Sprint ID:");
					if (!sprintIdStr.isEmpty()) {
						sprintId = Long.parseLong(sprintIdStr);
					}
				} catch (NumberFormatException e) {
					sendMessage(chatId, "Error: Sprint ID must be a valid number.");
					return;
				}
			}
			if (messageText.contains("Actual Time:")) {
				try {
					String tiempoRealStr = extractValue(messageText, "Actual Time:");
					if (!tiempoRealStr.isEmpty()) {
						tiempoReal = Double.parseDouble(tiempoRealStr);
					}
				} catch (NumberFormatException e) {
					sendMessage(chatId, "Error: Actual Time must be a valid number.");
					return;
				}
			}
			if (messageText.contains("Type:")) {
				tipo = extractValue(messageText, "Type:");
			}

			Tarea tarea = tareaService.updateTask(taskId, titulo, descripcion, tiempoEstimado,
												estadoId, prioridadId, proyectoId, sprintId,
												tiempoReal, tipo);

			if (tarea != null) {
				sendMessage(chatId, "Task " + taskId + " updated successfully!");
			} else {
				sendMessage(chatId, "Error updating task. Task not found.");
			}
		} catch (NumberFormatException e) {
			sendMessage(chatId, "Error: Please ensure Task ID is a valid number.");
		} catch (Exception e) {
			logger.error("Error updating task: " + e.getMessage(), e);
			sendMessage(chatId, "Error updating task: " + e.getMessage());
		}
	}

	private void showAllTasks(long chatId) {
		try {
			List<Object[]> tasks = tareaService.findAllWithEstadoAndUser();
			logger.info("Found {} tasks in the database", tasks.size());
			
			if (tasks.isEmpty()) {
				sendMessage(chatId, "No tasks found in the database. Please check if there are tasks in the TAREAS table.");
				return;
			}
			
			StringBuilder message = new StringBuilder("All Tasks:\n\n");
			for (Object[] task : tasks) {
				message.append("ID: ").append(task[0])
					   .append("\nTitle: ").append(task[1])
					   .append("\nDescription: ").append(task[2] != null ? task[2] : "")
					   .append("\nCreated: ").append(task[3]);
				
				// Only show type if it's not null
				if (task[4] != null) {
					message.append("\nType: ").append(task[4]);
				}
				
				message.append("\nStatus: ").append(task[5])
					   .append("\nAssigned to: ").append(task[6] != null ? task[6] : "Not assigned")
					   .append("\n\n");
			}
			sendMessage(chatId, message.toString());
		} catch (Exception e) {
			logger.error("Error showing all tasks: " + e.getMessage(), e);
			sendMessage(chatId, "Error retrieving tasks: " + e.getMessage());
		}
	}

	private void showCurrentSprintTasks(long chatId) {
		try {
			List<Object[]> sprintsWithTasks = sprintService.findAllSprintsWithTasks();
			logger.info("Found {} sprints in the database", sprintsWithTasks.size());
			
			if (sprintsWithTasks.isEmpty()) {
				sendMessage(chatId, "No sprints found in the database.");
				return;
			}
			
			StringBuilder message = new StringBuilder("Sprints and their Tasks:\n\n");
			Long currentSprintId = null;
			boolean firstSprint = true;
			
			for (Object[] row : sprintsWithTasks) {
				Long sprintId = (Long) row[0];
				String sprintNombre = (String) row[1];
				LocalDate fechaInicio = (LocalDate) row[2];
				LocalDate fechaFin = (LocalDate) row[3];
				String estado = (String) row[4];
				Long taskId = (Long) row[5];
				String taskTitulo = (String) row[6];
				
				// If this is a new sprint, print its details
				if (!sprintId.equals(currentSprintId)) {
					if (!firstSprint) {
						message.append("\n");
					}
					message.append("Sprint: ").append(sprintNombre)
						   .append("\nStart: ").append(fechaInicio)
						   .append("\nEnd: ").append(fechaFin)
						   .append("\nStatus: ").append(estado)
						   .append("\nTasks:\n");
					currentSprintId = sprintId;
					firstSprint = false;
				}
				
				// Print task if it exists
				if (taskId != null && taskTitulo != null) {
					message.append("    • ").append(taskTitulo).append("\n");
				}
			}
			
			sendMessage(chatId, message.toString());
		} catch (Exception e) {
			logger.error("Error showing sprint tasks: " + e.getMessage(), e);
			sendMessage(chatId, "Error retrieving sprint tasks: " + e.getMessage());
		}
	}

	@Override
	public String getBotUsername() {
		return botName;
	}
}