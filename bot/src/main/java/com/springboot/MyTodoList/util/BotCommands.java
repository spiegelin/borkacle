package com.springboot.MyTodoList.util;

public enum BotCommands {

	START_COMMAND("/start"), 
	HIDE_COMMAND("/hide"), 
	LIST_TASKS("/listtasks"),
	ADD_TASK("/addtask"),
	COMPLETE_TASK("/completetask"),
	ASSIGN_SPRINT("/assignsprint"),
	SHOW_SPRINT("/showsprint"),
	MY_TASKS("/mytasks"),
	HELP("/help"),
	ASSIGN_USER("/assignuser"),
	EDIT_TASK("/edittask");

	private String command;

	BotCommands(String enumCommand) {
		this.command = enumCommand;
	}

	public String getCommand() {
		return command;
	}
}
