package com.springboot.MyTodoList.util;

public enum BotMessages {
	
	HELLO_MYTODO_BOT(
	"Hello! I'm Task Management Bot!\nI can help you manage your tasks and sprints.\nUse /help to see available commands."),
	BOT_REGISTERED_STARTED("Bot registered and started successfully!"),
	TASK_ADDED("Task added successfully! Use /listtasks to see all tasks."),
	TASK_COMPLETED("Task marked as completed! Use /listtasks to see all tasks."),
	TASK_ASSIGNED("Task assigned to sprint! Use /showsprint to see sprint tasks."),
	TYPE_NEW_TASK("Please provide task details in the following format:\n" +
				  "Title: [task title]\n" +
				  "Description: [task description]\n" +
				  "Estimated Time: [hours]\n" +
				  "Priority: [HIGH/MEDIUM/LOW]"),
	TYPE_TASK_COMPLETION("Please provide task completion details:\n" +
						 "Task ID: [id]\n" +
						 "Actual Time: [hours]"),
	TYPE_SPRINT_ASSIGNMENT("Please provide sprint assignment details:\n" +
						   "Task ID: [id]\n" +
						   "Sprint ID: [id]"),
	HELP_MESSAGE("Available commands:\n" +
				 "/start - Show main menu\n" +
				 "/help - Show this help message\n" +
				 "/addtask - Create a new task\n" +
				 "/listtasks - Show all tasks\n" +
				 "/assignuser - Assign a user to a task\n" +
				 "/assignsprint - Assign a task to a sprint\n" +
				 "/completetask - Mark a task as completed\n" +
				 "/edittask - Edit an existing task\n" +
				 "/showsprint - Show current sprint tasks\n" +
				 "/hide - Hide keyboard"),
	BYE("Bye! Use /start to resume!");

	private String message;

	BotMessages(String enumMessage) {
		this.message = enumMessage;
	}

	public String getMessage() {
		return message;
	}

}
