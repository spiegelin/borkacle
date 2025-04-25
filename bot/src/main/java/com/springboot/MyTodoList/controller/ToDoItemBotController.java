package com.springboot.MyTodoList.controller;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
	
	@Autowired
	private KpiService kpiService;

	private String botToken;
	private String botName;

	private Map<Long, String> pendingAuthEmails = new HashMap<>();
	private Map<Long, String> userRoles = new HashMap<>();
	private static final int MAX_RETRIES = 3;

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

			try {
				logger.info("Recibido mensaje: '{}' desde chatId: {}", messageText, chatId);
				
				if (messageText.equals("/start")) {
					showMainMenu(chatId);
				} else if (messageText.equals("❓ Help")) {
					sendMessageWithRetry(chatId, BotMessages.HELP_MESSAGE.getMessage(), null);
				} else if (messageText.equals("➕ Add Task")) {
					String helpMessage = "Por favor proporcione los detalles de la tarea *exactamente* en el siguiente formato:\n\n" +
										 "Title: Nombre de la tarea\n" +
										 "Description: Descripción detallada\n" +
										 "Estimated Time: 2.5\n" +
										 "Project ID: 1\n" +
										 "Priority ID: 2\n\n" +
										 "⚠️ Es importante mantener este formato exacto, con cada campo en una línea separada y seguido de dos puntos (:)\n\n" +
										 "📋 Aquí tienes un ejemplo que puedes copiar y pegar (modifica los valores):\n\n" +
										 "Title: Nueva tarea de prueba\n" +
										 "Description: Esta es una descripción de prueba\n" +
										 "Estimated Time: 1.5\n" +
										 "Project ID: 1\n" +
										 "Priority ID: 1";
					sendMessageWithRetry(chatId, helpMessage, null);
				} else if (messageText.equals("📋 List Tasks")) {
					showAllTasks(chatId);
				} else if (messageText.equals("👥 Assign User")) {
					sendMessageWithRetry(chatId, "Please provide assignment details:\n" +
												  "Task ID: [task id]\n" +
												  "User ID: [user id]", null);
				} else if (messageText.equals("📅 Assign Sprint")) {
					sendMessageWithRetry(chatId, "Please provide sprint assignment details:\n" +
												  "Task ID: [task id]\n" +
												  "Sprint ID: [sprint id]", null);
				} else if (messageText.equals("✅ Complete Task")) {
					sendMessageWithRetry(chatId, "Please provide completion details:\n" +
												  "Task ID: [task id]\n" +
												  "Actual Time: [hours]", null);
				} else if (messageText.equals("✏️ Edit Task")) {
					sendMessageWithRetry(chatId, "Please provide task details to update (only include fields you want to change):\n" +
												  "Task ID: [task id]\n" +
												  "Title: [new title]\n" +
												  "Description: [new description]\n" +
												  "Estimated Time: [new hours]\n" +
												  "Estado ID: [new estado id]\n" +
												  "Priority ID: [new priority id]\n" +
												  "Project ID: [new project id]\n" +
												  "Sprint ID: [new sprint id]\n" +
												  "Actual Time: [new hours]", null);
				} else if (messageText.equals("📊 Show Sprint")) {
					showCurrentSprintTasks(chatId);
				} else if (messageText.equals("❌ Hide")) {
					hideKeyboard(chatId);
				} else if (messageText.equals("🔑 Auth")) {
					sendMessageWithRetry(chatId, "Please enter your email:", null);
					pendingAuthEmails.put(chatId, "WAITING_EMAIL");
				} else if (pendingAuthEmails.containsKey(chatId)) {
					if (pendingAuthEmails.get(chatId).equals("WAITING_EMAIL")) {
						pendingAuthEmails.put(chatId, messageText);
						sendMessageWithRetry(chatId, "Please enter your password:", null);
					} else {
						String email = pendingAuthEmails.get(chatId);
						handleAuthentication(chatId, email, messageText);
						pendingAuthEmails.remove(chatId);
					}
				} else if (userRoles.containsKey(chatId)) {
					handleAuthenticatedCommand(chatId, messageText);
				} else {
					// Handle task creation based on message format
					if (messageText.contains("Title:") && messageText.contains("Estimated Time:") && 
						messageText.contains("Project ID:")) {
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
						messageText.contains("Actual Time:"))) {
						handleTaskUpdate(chatId, messageText);
					}
				}
			} catch (Exception e) {
				logger.error("Error processing update: {}", e.getMessage(), e);
				sendMessageWithRetry(chatId, "An error occurred. Please try again.", null);
				showMainMenu(chatId);
			}
		}
	}

	private void sendMessageWithRetry(long chatId, String text, ReplyKeyboardMarkup keyboard) {
		int retries = 0;
		while (retries < MAX_RETRIES) {
			try {
				SendMessage message = new SendMessage();
				message.setChatId(chatId);
				message.setText(text);
				if (keyboard != null) {
					message.setReplyMarkup(keyboard);
				}
				execute(message);
				logger.info("Message sent successfully to chat {}", chatId);
				return;
			} catch (TelegramApiException e) {
				retries++;
				logger.error("Error sending message (attempt {}/{}): {}", retries, MAX_RETRIES, e.getMessage());
				if (retries == MAX_RETRIES) {
					logger.error("Failed to send message after {} attempts", MAX_RETRIES);
					return;
				}
				try {
					Thread.sleep(1000 * retries); // Exponential backoff
				} catch (InterruptedException ie) {
					Thread.currentThread().interrupt();
					return;
				}
			}
		}
	}

	private void showMainMenu(long chatId) {
		ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
		List<KeyboardRow> keyboard = new ArrayList<>();
		KeyboardRow row1 = new KeyboardRow();
		row1.add("❓ Help");
		row1.add("🔑 Auth");
		keyboard.add(row1);
		keyboardMarkup.setKeyboard(keyboard);
		keyboardMarkup.setResizeKeyboard(true);
		keyboardMarkup.setOneTimeKeyboard(false);
		keyboardMarkup.setSelective(true);

		sendMessageWithRetry(chatId, "Welcome to the Task Management Bot! Please select an option:", keyboardMarkup);
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

	private String extractValue(String message, String field) {
		try {
			logger.debug("Extrayendo campo '{}' del mensaje", field);
			if (!message.contains(field)) {
				logger.debug("Campo '{}' no encontrado en el mensaje", field);
				return "";
			}
			
			int startIndex = message.indexOf(field) + field.length();
			int endIndex = message.indexOf("\n", startIndex);
			if (endIndex == -1) {
				endIndex = message.length();
			}
			
			String value = message.substring(startIndex, endIndex).trim();
			logger.debug("Valor extraído para '{}': '{}'", field, value);
			return value;
		} catch (Exception e) {
			logger.error("Error al extraer el valor para el campo '{}': {}", field, e.getMessage());
			return "";
		}
	}

	private void handleTaskCreation(long chatId, String messageText) {
		try {
			logger.info("Iniciando creación de tarea con mensaje: {}", messageText);
			
			// Parse task details from message
			String title = extractValue(messageText, "Title:");
			String description = extractValue(messageText, "Description:");
			String estimatedTimeStr = extractValue(messageText, "Estimated Time:");
			String proyectoIdStr = extractValue(messageText, "Project ID:");
			String prioridadIdStr = extractValue(messageText, "Priority ID:");
			
			logger.info("Datos extraídos - Título: {}, Descripción: {}, Tiempo Estimado: {}, Proyecto ID: {}, Prioridad ID: {}", 
					   title, description, estimatedTimeStr, proyectoIdStr, prioridadIdStr);
			
			// Validar que los campos requeridos no estén vacíos
			if (title.isEmpty()) {
				sendMessageWithRetry(chatId, "Error: El título no puede estar vacío.", null);
				return;
			}
			
			Double estimatedTime = null;
			try {
				estimatedTime = Double.parseDouble(estimatedTimeStr);
			} catch (NumberFormatException e) {
				sendMessageWithRetry(chatId, "Error: El tiempo estimado debe ser un número válido.", null);
				return;
			}
			
			Long proyectoId = null;
			try {
				proyectoId = Long.parseLong(proyectoIdStr);
			} catch (NumberFormatException e) {
				sendMessageWithRetry(chatId, "Error: El ID del proyecto debe ser un número válido.", null);
				return;
			}
			
			Long prioridadId = null;
			if (!prioridadIdStr.isEmpty()) {
				try {
					prioridadId = Long.parseLong(prioridadIdStr);
				} catch (NumberFormatException e) {
					sendMessageWithRetry(chatId, "Error: Priority ID must be a valid number.", null);
					return;
				}
			}

			// Validate estimated time
			if (estimatedTime > 4.0) {
				sendMessageWithRetry(chatId, "Error: Estimated time cannot exceed 4 hours. Please break down the task into smaller subtasks.", null);
				return;
			}

			logger.info("Creando tarea con datos validados: Título={}, Tiempo={}, ProyectoID={}, PrioridadID={}", 
						estimatedTime, proyectoId, prioridadId);
			
			// Create task
			Tarea tarea = tareaService.createTarea(title, description, estimatedTime, proyectoId, prioridadId);

			if (tarea != null) {
				logger.info("Tarea creada exitosamente con ID: {}", tarea.getId());
				sendMessageWithRetry(chatId, "Task created successfully!\nID: " + tarea.getId(), null);
			} else {
				logger.error("Error al crear la tarea: tareaService.createTarea devolvió null");
				sendMessageWithRetry(chatId, "Error creating task. Please try again.", null);
			}
		} catch (NumberFormatException e) {
			logger.error("Error de formato numérico: {}", e.getMessage());
			sendMessageWithRetry(chatId, "Error: Please ensure all numeric fields (Estimated Time, Project ID) are valid numbers.", null);
		} catch (Exception e) {
			logger.error("Error creating task: {}", e.getMessage(), e);
			sendMessageWithRetry(chatId, "Error creating task: " + e.getMessage(), null);
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
				tarea = tareaService.updateTask(taskId, null, null, null, 1L, null, null, null, null);
				if (tarea != null) {
					sendMessageWithRetry(chatId, "User assigned successfully to task " + taskId + " and task status updated to 'In Progress'", null);
				} else {
					sendMessageWithRetry(chatId, "Error updating task status. User was assigned but status update failed.", null);
				}
			} else {
				sendMessageWithRetry(chatId, "Error assigning user. Task or user not found.", null);
			}
		} catch (NumberFormatException e) {
			sendMessageWithRetry(chatId, "Error: Please ensure Task ID and User ID are valid numbers.", null);
		} catch (Exception e) {
			logger.error("Error assigning user: " + e.getMessage(), e);
			sendMessageWithRetry(chatId, "Error assigning user: " + e.getMessage(), null);
		}
	}

	private void handleSprintAssignment(long chatId, String messageText) {
		try {
			Long taskId = Long.parseLong(extractValue(messageText, "Task ID:"));
			Long sprintId = Long.parseLong(extractValue(messageText, "Sprint ID:"));

			Tarea tarea = tareaService.assignSprint(taskId, sprintId);
			if (tarea != null) {
				sendMessageWithRetry(chatId, "Sprint assigned successfully to task " + taskId, null);
			} else {
				sendMessageWithRetry(chatId, "Error assigning sprint. Task or sprint not found.", null);
			}
		} catch (NumberFormatException e) {
			sendMessageWithRetry(chatId, "Error: Please ensure Task ID and Sprint ID are valid numbers.", null);
		} catch (Exception e) {
			logger.error("Error assigning sprint: " + e.getMessage(), e);
			sendMessageWithRetry(chatId, "Error assigning sprint: " + e.getMessage(), null);
		}
	}

	private void handleTaskCompletion(long chatId, String messageText) {
		try {
			Long taskId = Long.parseLong(extractValue(messageText, "Task ID:"));
			Double actualTime = Double.parseDouble(extractValue(messageText, "Actual Time:"));

			Tarea tarea = tareaService.completeTask(taskId, actualTime);
			if (tarea != null) {
				sendMessageWithRetry(chatId, "Task " + taskId + " marked as completed!", null);
			} else {
				sendMessageWithRetry(chatId, "Error completing task. Task not found.", null);
			}
		} catch (NumberFormatException e) {
			sendMessageWithRetry(chatId, "Error: Please ensure Task ID and Actual Time are valid numbers.", null);
		} catch (Exception e) {
			logger.error("Error completing task: " + e.getMessage(), e);
			sendMessageWithRetry(chatId, "Error completing task: " + e.getMessage(), null);
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
					sendMessageWithRetry(chatId, "Error: Estimated Time must be a valid number.", null);
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
					sendMessageWithRetry(chatId, "Error: Estado ID must be a valid number.", null);
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
					sendMessageWithRetry(chatId, "Error: Priority ID must be a valid number.", null);
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
					sendMessageWithRetry(chatId, "Error: Project ID must be a valid number.", null);
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
					sendMessageWithRetry(chatId, "Error: Sprint ID must be a valid number.", null);
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
					sendMessageWithRetry(chatId, "Error: Actual Time must be a valid number.", null);
					return;
				}
			}

			Tarea tarea = tareaService.updateTask(taskId, titulo, descripcion, tiempoEstimado,
												estadoId, prioridadId, proyectoId, sprintId,
												tiempoReal);

			if (tarea != null) {
				sendMessageWithRetry(chatId, "Task " + taskId + " updated successfully!", null);
			} else {
				sendMessageWithRetry(chatId, "Error updating task. Task not found.", null);
			}
		} catch (NumberFormatException e) {
			sendMessageWithRetry(chatId, "Error: Please ensure Task ID is a valid number.", null);
		} catch (Exception e) {
			logger.error("Error updating task: " + e.getMessage(), e);
			sendMessageWithRetry(chatId, "Error updating task: " + e.getMessage(), null);
		}
	}

	private void showAllTasks(long chatId) {
		try {
			List<Object[]> tasks = tareaService.findAllWithEstadoAndUser();
			logger.info("Found {} tasks in the database", tasks.size());
			
			if (tasks.isEmpty()) {
				sendMessageWithRetry(chatId, "No tasks found in the database. Please check if there are tasks in the TAREAS table.", null);
				return;
			}
			
			StringBuilder message = new StringBuilder("All Tasks:\n\n");
			for (Object[] task : tasks) {
				message.append("ID: ").append(task[0])
					   .append("\nTitle: ").append(task[1])
					   .append("\nDescription: ").append(task[2] != null ? task[2] : "")
					   .append("\nCreated: ").append(task[3])
					   .append("\nStatus: ").append(task[4])
					   .append("\nAssigned to: ").append(task[5] != null ? task[5] : "Not assigned")
					   .append("\n\n");
			}
			sendMessageWithRetry(chatId, message.toString(), null);
		} catch (Exception e) {
			logger.error("Error showing all tasks: " + e.getMessage(), e);
			sendMessageWithRetry(chatId, "Error retrieving tasks: " + e.getMessage(), null);
		}
	}

	private void showCurrentSprintTasks(long chatId) {
		try {
			List<Object[]> sprintsWithTasks = sprintService.findAllSprintsWithTasks();
			logger.info("Found {} sprints in the database", sprintsWithTasks.size());
			
			if (sprintsWithTasks.isEmpty()) {
				sendMessageWithRetry(chatId, "No sprints found in the database.", null);
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
			
			sendMessageWithRetry(chatId, message.toString(), null);
		} catch (Exception e) {
			logger.error("Error showing sprint tasks: " + e.getMessage(), e);
			sendMessageWithRetry(chatId, "Error retrieving sprint tasks: " + e.getMessage(), null);
		}
	}

	private void handleAuthentication(long chatId, String email, String password) {
		try {
			Optional<Usuario> usuario = usuarioService.findByEmail(email);
			if (usuario.isPresent()) {
				// Use BCrypt's matches method to verify the password against the stored hash
				boolean passwordMatches = verifyPassword(password, usuario.get().getPasswordHash());
				if (passwordMatches) {
					String role = usuario.get().getRol();
					userRoles.put(chatId, role);
					
					// Obtener token JWT del controlador para esta sesión
					try {
						String jwtToken = kpiService.authenticateWithController(email, password);
						if (jwtToken != null && !jwtToken.isEmpty()) {
							logger.info("Obtenido token JWT del controlador para el usuario: {}", email);
						} else {
							logger.warn("No se pudo obtener token JWT del controlador para el usuario: {}", email);
						}
					} catch (Exception e) {
						logger.error("Error al obtener token JWT del controlador: {}", e.getMessage());
					}
					
					if (role.equals("administrador")) {
						showAdminMenu(chatId);
					} else {
						showUserMenu(chatId);
					}
				} else {
					sendMessageWithRetry(chatId, "Authentication failed. Please check your email and password.", null);
					showMainMenu(chatId);
				}
			} else {
				sendMessageWithRetry(chatId, "Authentication failed. Please check your email and password.", null);
				showMainMenu(chatId);
			}
		} catch (Exception e) {
			logger.error("Error during authentication: {}", e.getMessage());
			sendMessageWithRetry(chatId, "An error occurred during authentication. Please try again.", null);
			showMainMenu(chatId);
		}
	}

	// Add a method to verify the password against a stored hash
	private boolean verifyPassword(String rawPassword, String storedHash) {
		try {
			// Use Spring's BCrypt password encoder to verify the password
			org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder encoder = 
				new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
			return encoder.matches(rawPassword, storedHash);
		} catch (Exception e) {
			logger.error("Error verifying password: {}", e.getMessage());
			return false;
		}
	}

	private void showAdminMenu(long chatId) {
		ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
		List<KeyboardRow> keyboard = new ArrayList<>();
		KeyboardRow row1 = new KeyboardRow();
		row1.add("➕ Add Task");
		row1.add("📋 List Tasks");
		keyboard.add(row1);
		KeyboardRow row2 = new KeyboardRow();
		row2.add("👥 Assign User");
		row2.add("📅 Assign Sprint");
		keyboard.add(row2);
		KeyboardRow row3 = new KeyboardRow();
		row3.add("✅ Complete Task");
		row3.add("✏️ Edit Task");
		keyboard.add(row3);
		KeyboardRow row4 = new KeyboardRow();
		row4.add("📊 Show Sprint");
		row4.add("📊 KPI Equipo");
		keyboard.add(row4);
		KeyboardRow row5 = new KeyboardRow();
		row5.add("📊 KPI Persona");
		row5.add("❓ Help");
		keyboard.add(row5);
		KeyboardRow row6 = new KeyboardRow();
		row6.add("❌ Hide");
		keyboard.add(row6);
		keyboardMarkup.setKeyboard(keyboard);
		keyboardMarkup.setResizeKeyboard(true);
		keyboardMarkup.setOneTimeKeyboard(false);
		keyboardMarkup.setSelective(true);

		sendMessageWithRetry(chatId, "Welcome, Administrator! Please select an option:", keyboardMarkup);
	}

	private void showUserMenu(long chatId) {
		ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
		List<KeyboardRow> keyboard = new ArrayList<>();
		KeyboardRow row1 = new KeyboardRow();
		row1.add("📋 List Tasks");
		row1.add("📊 Show Sprint");
		keyboard.add(row1);
		KeyboardRow row2 = new KeyboardRow();
		row2.add("✅ Complete Task");
		row2.add("📊 KPI Persona");
		keyboard.add(row2);
		KeyboardRow row3 = new KeyboardRow();
		row3.add("❓ Help");
		row3.add("❌ Hide");
		keyboard.add(row3);
		keyboardMarkup.setKeyboard(keyboard);
		keyboardMarkup.setResizeKeyboard(true);
		keyboardMarkup.setOneTimeKeyboard(false);
		keyboardMarkup.setSelective(true);

		sendMessageWithRetry(chatId, "Welcome! Please select an option:", keyboardMarkup);
	}

	private void handleAuthenticatedCommand(long chatId, String messageText) {
		String role = userRoles.get(chatId);
		if (role == null) {
			showMainMenu(chatId);
			return;
		}

		if (role.equals("administrador")) {
			handleAdminCommand(chatId, messageText);
		} else {
			handleUserCommand(chatId, messageText);
		}
	}

	private void handleAdminCommand(long chatId, String messageText) {
		// Handle admin commands
		if (messageText.equals("➕ Add Task")) {
			String helpMessage = "Por favor proporcione los detalles de la tarea *exactamente* en el siguiente formato:\n\n" +
								 "Title: Nombre de la tarea\n" +
								 "Description: Descripción detallada\n" +
								 "Estimated Time: 2.5\n" +
								 "Project ID: 1\n" +
								 "Priority ID: 2\n\n" +
								 "⚠️ Es importante mantener este formato exacto, con cada campo en una línea separada y seguido de dos puntos (:)\n\n" +
								 "📋 Aquí tienes un ejemplo que puedes copiar y pegar (modifica los valores):\n\n" +
								 "Title: Nueva tarea de prueba\n" +
								 "Description: Esta es una descripción de prueba\n" +
								 "Estimated Time: 1.5\n" +
								 "Project ID: 1\n" +
								 "Priority ID: 1";
			sendMessageWithRetry(chatId, helpMessage, null);
		} else if (messageText.equals("📋 List Tasks")) {
			showAllTasks(chatId);
		} else if (messageText.equals("👥 Assign User")) {
			sendMessageWithRetry(chatId, "Please provide assignment details:\n" +
								  "Task ID: [task id]\n" +
								  "User ID: [user id]", null);
		} else if (messageText.equals("📅 Assign Sprint")) {
			sendMessageWithRetry(chatId, "Please provide sprint assignment details:\n" +
								  "Task ID: [task id]\n" +
								  "Sprint ID: [sprint id]", null);
		} else if (messageText.equals("✅ Complete Task")) {
			sendMessageWithRetry(chatId, "Please provide completion details:\n" +
								  "Task ID: [task id]\n" +
								  "Actual Time: [hours]", null);
		} else if (messageText.equals("✏️ Edit Task")) {
			sendMessageWithRetry(chatId, "Please provide task details to update (only include fields you want to change):\n" +
								  "Task ID: [task id]\n" +
								  "Title: [new title]\n" +
								  "Description: [new description]\n" +
								  "Estimated Time: [new hours]\n" +
								  "Estado ID: [new estado id]\n" +
								  "Priority ID: [new priority id]\n" +
								  "Project ID: [new project id]\n" +
								  "Sprint ID: [new sprint id]\n" +
								  "Actual Time: [new hours]", null);
		} else if (messageText.equals("📊 Show Sprint")) {
			showCurrentSprintTasks(chatId);
		} else if (messageText.equals("📊 KPI Equipo")) {
			showKpiEquipo(chatId);
		} else if (messageText.equals("📊 KPI Persona")) {
			showKpiPersona(chatId);
		} else if (messageText.equals("❌ Hide")) {
			hideKeyboard(chatId);
		} else {
			showAdminMenu(chatId);
		}
	}

	private void handleUserCommand(long chatId, String messageText) {
		// Handle user commands
		if (messageText.equals("📋 List Tasks")) {
			showAllTasks(chatId);
		} else if (messageText.equals("📊 Show Sprint")) {
			showCurrentSprintTasks(chatId);
		} else if (messageText.equals("✅ Complete Task")) {
			sendMessageWithRetry(chatId, "Please provide completion details:\n" +
								  "Task ID: [task id]\n" +
								  "Actual Time: [hours]", null);
		} else if (messageText.equals("📊 KPI Persona")) {
			showKpiPersona(chatId);
		} else if (messageText.equals("❌ Hide")) {
			hideKeyboard(chatId);
		} else {
			showUserMenu(chatId);
		}
	}

	private void showKpiEquipo(long chatId) {
		try {
			logger.info("Fetching KPI data for teams");
			String kpiData = kpiService.getKpiEquipoData();
			
			if (kpiData != null) {
				// Format the KPI data for display
				StringBuilder message = new StringBuilder("📊 *KPI POR EQUIPO*\n\n");
				message.append(formatKpiEquipoData(kpiData));
				sendMessageWithRetry(chatId, message.toString(), null);
				logger.info("KPI team data sent to chat ID: {}", chatId);
			} else {
				sendMessageWithRetry(chatId, "❌ No se pudieron obtener los datos de KPI por equipo.", null);
				logger.error("Failed to get KPI team data for chat ID: {}", chatId);
			}
		} catch (Exception e) {
			logger.error("Error showing KPI team data: {}", e.getMessage(), e);
			sendMessageWithRetry(chatId, "❌ Error al mostrar datos de KPI por equipo: " + e.getMessage(), null);
		}
	}
	
	private void showKpiPersona(long chatId) {
		try {
			logger.info("Fetching KPI data for users");
			String kpiData = kpiService.getKpiPersonaData();
			
			if (kpiData != null) {
				// Format the KPI data for display
				StringBuilder message = new StringBuilder("📊 *KPI POR PERSONA*\n\n");
				message.append(formatKpiPersonaData(kpiData));
				sendMessageWithRetry(chatId, message.toString(), null);
				logger.info("KPI user data sent to chat ID: {}", chatId);
			} else {
				sendMessageWithRetry(chatId, "❌ No se pudieron obtener los datos de KPI por persona.", null);
				logger.error("Failed to get KPI user data for chat ID: {}", chatId);
			}
		} catch (Exception e) {
			logger.error("Error showing KPI user data: {}", e.getMessage(), e);
			sendMessageWithRetry(chatId, "❌ Error al mostrar datos de KPI por persona: " + e.getMessage(), null);
		}
	}
	
	private String formatKpiEquipoData(String jsonData) {
		// Simple formatting of raw JSON data
		// In a real implementation, you would parse the JSON and format it nicely
		try {
			return "Datos de KPI por equipo:\n\n" + jsonData;
		} catch (Exception e) {
			logger.error("Error formatting KPI team data: {}", e.getMessage());
			return "Error al formatear datos de KPI por equipo";
		}
	}
	
	private String formatKpiPersonaData(String jsonData) {
		try {
			// Parsear el JSON de forma básica y construir un formato legible
			if (jsonData == null || jsonData.isEmpty()) {
				return "No hay datos disponibles.";
			}
			
			StringBuilder result = new StringBuilder();
			
			// Eliminar los corchetes externos del array JSON
			String content = jsonData.trim();
			if (content.startsWith("[")) {
				content = content.substring(1);
			}
			if (content.endsWith("]")) {
				content = content.substring(0, content.length() - 1);
			}
			
			// Dividir por usuarios (cada objeto JSON separado por "},{"
			String[] usuariosJson = content.split("\\},\\{");
			
			for (int i = 0; i < usuariosJson.length; i++) {
				String usuarioJson = usuariosJson[i];
				
				// Limpiar el primer y último usuario
				if (i == 0 && usuarioJson.startsWith("{")) {
					usuarioJson = usuarioJson.substring(1);
				}
				if (i == usuariosJson.length - 1 && usuarioJson.endsWith("}")) {
					usuarioJson = usuarioJson.substring(0, usuarioJson.length() - 1);
				}
				
				// Extraer ID y nombre de usuario
				String usuarioId = extractJsonValue(usuarioJson, "usuarioId");
				String usuarioNombre = extractJsonValue(usuarioJson, "usuarioNombre");
				
				result.append("👤 *").append(usuarioNombre).append("* (ID: ").append(usuarioId).append(")\n");
				
				// Extraer sprints
				int sprintsStart = usuarioJson.indexOf("\"sprints\":[");
				if (sprintsStart != -1) {
					String sprintsJson = extractJsonArray(usuarioJson.substring(sprintsStart + 10));
					
					// Eliminar corchetes del array de sprints
					if (sprintsJson.startsWith("[")) {
						sprintsJson = sprintsJson.substring(1);
					}
					if (sprintsJson.endsWith("]")) {
						sprintsJson = sprintsJson.substring(0, sprintsJson.length() - 1);
					}
					
					// Dividir por sprints
					String[] sprintsArr = sprintsJson.split("\\},\\{");
					
					if (sprintsArr.length > 0) {
						boolean hasSprints = false;
						
						for (int j = 0; j < sprintsArr.length; j++) {
							String sprintJson = sprintsArr[j];
							
							// Limpiar el primer y último sprint
							if (j == 0 && sprintJson.startsWith("{")) {
								sprintJson = sprintJson.substring(1);
							}
							if (j == sprintsArr.length - 1 && sprintJson.endsWith("}")) {
								sprintJson = sprintJson.substring(0, sprintJson.length() - 1);
							}
							
							// Extraer datos del sprint
							String sprintNombre = extractJsonValue(sprintJson, "sprintNombre");
							String horasEstimadas = extractJsonValue(sprintJson, "horasEstimadas");
							String horasReales = extractJsonValue(sprintJson, "horasReales");
							String tareasCompletadas = extractJsonValue(sprintJson, "tareasCompletadas");
							String tareasTotales = extractJsonValue(sprintJson, "tareasTotales");
							String eficiencia = extractJsonValue(sprintJson, "eficiencia");
							
							// Solo mostrar sprints con tareas asignadas
							if (!"0".equals(tareasTotales) && !"0.0".equals(horasEstimadas)) {
								hasSprints = true;
								result.append("  📅 *").append(sprintNombre).append("*\n");
								result.append("     - Horas estimadas: ").append(formatHoras(horasEstimadas)).append("\n");
								result.append("     - Horas reales: ").append(formatHoras(horasReales)).append("\n");
								result.append("     - Tareas: ").append(tareasCompletadas).append("/").append(tareasTotales).append("\n");
								
								// Formatear la eficiencia para que sea legible
								String eficienciaFormateada = formatEficiencia(eficiencia);
								result.append("     - Eficiencia: ").append(eficienciaFormateada).append("\n");
							}
						}
						
						if (!hasSprints) {
							result.append("  No tiene tareas en sprints activos\n");
						}
					} else {
						result.append("  No tiene sprints asignados\n");
					}
				} else {
					result.append("  No tiene sprints asignados\n");
				}
				
				// Separador entre usuarios
				result.append("\n");
			}
			
			return result.toString();
		} catch (Exception e) {
			logger.error("Error formatting KPI user data: {}", e.getMessage(), e);
			return "Error al formatear datos: " + e.getMessage() + "\n\nDatos en formato JSON original:\n\n" + jsonData;
		}
	}
	
	// Método auxiliar para extraer un valor de un campo JSON
	private String extractJsonValue(String json, String field) {
		String searchFor = "\"" + field + "\":";
		int start = json.indexOf(searchFor) + searchFor.length();
		if (start == -1 + searchFor.length()) {
			return "";
		}
		
		// Verificar si el valor es una cadena (con comillas) o un número/booleano
		boolean isString = json.charAt(start) == '"';
		
		if (isString) {
			start++; // Saltamos la comilla inicial
			int end = json.indexOf("\"", start);
			return json.substring(start, end);
		} else {
			// Para valores numéricos, buscamos hasta la coma o cierre de objeto
			int commaPos = json.indexOf(",", start);
			int bracketPos = json.indexOf("}", start);
			
			// Tomamos la posición más cercana
			int end = (commaPos != -1 && (bracketPos == -1 || commaPos < bracketPos)) ? commaPos : bracketPos;
			
			if (end == -1) {
				// Si no hay más separadores, hasta el final
				return json.substring(start);
			}
			return json.substring(start, end);
		}
	}
	
	// Método auxiliar para extraer un array JSON completo
	private String extractJsonArray(String json) {
		int depth = 0;
		int endPos = 0;
		
		for (int i = 0; i < json.length(); i++) {
			char c = json.charAt(i);
			if (c == '[') {
				depth++;
			} else if (c == ']') {
				depth--;
				if (depth == 0) {
					endPos = i + 1;
					break;
				}
			}
		}
		
		return json.substring(0, endPos);
	}
	
	// Método para formatear las horas
	private String formatHoras(String horas) {
		try {
			double horasNum = Double.parseDouble(horas);
			return String.format("%.1f h", horasNum);
		} catch (NumberFormatException e) {
			return horas;
		}
	}
	
	// Método para formatear la eficiencia
	private String formatEficiencia(String eficiencia) {
		try {
			// Casos especiales
			if (eficiencia.equals("Infinity") || eficiencia.equals("\"Infinity\"")) {
				return "∞ (tarea sin tiempo real registrado)";
			}
			
			// Convertir a número y a porcentaje
			double eficienciaNum = Double.parseDouble(eficiencia);
			eficienciaNum = Math.round(eficienciaNum * 10) / 10.0; // Redondear a 1 decimal
			
			// Determinar mensaje según la eficiencia
			String emoji;
			String mensaje;
			
			if (eficienciaNum > 150) {
				emoji = "🔥";
				mensaje = "Excelente";
			} else if (eficienciaNum > 100) {
				emoji = "✅";
				mensaje = "Muy bien";
			} else if (eficienciaNum >= 80) {
				emoji = "👍";
				mensaje = "Bien";
			} else if (eficienciaNum > 0) {
				emoji = "⚠️";
				mensaje = "Necesita mejorar";
			} else {
				emoji = "❓";
				mensaje = "Sin datos";
			}
			
			return String.format("%s %.1f%% (%s)", emoji, eficienciaNum, mensaje);
		} catch (NumberFormatException e) {
			return eficiencia;
		}
	}

	@Override
	public String getBotUsername() {
		return botName;
	}
}