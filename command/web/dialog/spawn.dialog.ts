/// <reference path="dialog.ts" />

class SpawnButton implements DialogButton {
	readonly text = "Spawn";
	readonly close = true;

	public onClick(dialog: Dialog) {
		console.log("Spawning");
	}
}

class SpawnDialog extends Dialog {

	constructor(client: Client) {
		super("static/spawn.dialog.html", "Spawn Process", new SpawnButton(), new CancelButton());
	}

	public onEnter() {

	}

	public onLeave() {

	}
}