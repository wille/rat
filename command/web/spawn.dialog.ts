/// <reference path="dialog.ts" />

class SpawnButton extends DialogButton {

	constructor() {
		super("Spawn");
	}

	onClick(parent: Dialog) {
		console.log("Spawning...");
	}
}

class SpawnDialog extends Dialog {

	constructor(id: number) {
		super("static/spawn.dialog.html", "Spawn Process", [
			new SpawnButton(),
			new CancelButton()
		], id);
	}

	onEnter() {

	}

	onLeave() {

	}
}