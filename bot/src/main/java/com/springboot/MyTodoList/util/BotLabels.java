package com.springboot.MyTodoList.util;

public enum BotLabels {
	
	SHOW_MAIN_SCREEN("Show Main Screen"), 
	HIDE_MAIN_SCREEN("Hide Main Screen"),
	LIST_ALL_TASKS("List All Tasks"),
	ADD_NEW_TASK("Add New Task"),
	COMPLETE_TASK("Complete Task"),
	ASSIGN_TO_SPRINT("Assign to Sprint"),
	SHOW_CURRENT_SPRINT("Show Current Sprint"),
	MY_TASKS("My Tasks"),
	HELP("Help"),
	DONE("DONE"),
	UNDO("UNDO"),
	DELETE("DELETE"),
	DASH("-"),
	ESTIMATED_TIME("Estimated Time"),
	ACTUAL_TIME("Actual Time"),
	PRIORITY("Priority"),
	DESCRIPTION("Description"),
	TITLE("Title"),
	SPRINT("Sprint");

	private String label;

	BotLabels(String enumLabel) {
		this.label = enumLabel;
	}

	public String getLabel() {
		return label;
	}

}
