/// <reference path="../views/view.ts" />

abstract class Dialog extends AbstractView {

	constructor(url: string, title: string, public dialogButtons: DialogButton[], public client?: Client) {
		super(url, title);
	}

	abstract onEnter();
	abstract onLeave();
}

abstract class DialogButton {

	constructor(public text: string, public close: boolean = true) {

	}

	abstract onClick(parent?: Dialog);
}

class CancelButton extends DialogButton {
	
	constructor() {
		super("Cancel", true);
	}

	onClick() {
		// Will close on click
	}
}

function showDialog(dialog: Dialog) {
	let element = document.createElement("div");
	element.id = "dialog";

	$(element).load(dialog.url);

	let buttons = {};
	for (let button of dialog.dialogButtons) {
		buttons[button.text] = () => {
			button.onClick(dialog);

			if (button.close) {
				dialog.onLeave();
				$(element).dialog("close");
			}
		};
	}

	$(element).dialog({
		title: dialog.title,
		resizable: false,
		height: "auto",
		width: 400,
		modal: true,
		buttons: buttons
	});

	dialog.onEnter();
}