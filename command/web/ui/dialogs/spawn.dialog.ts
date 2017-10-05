/// <reference path="dialog.ts" />

namespace Web.UI.Dialogs {
    
    class SpawnButton implements DialogButton {
        readonly text = "Spawn";
        readonly close = true;
    
        public onClick(dialog: Dialog) {
            console.log("Spawning");
        }
    }
    
    export class SpawnDialog extends Dialog {
    
        constructor(client: Client) {
            super("static/spawn.dialog.html", "Spawn Process", new SpawnButton(), new CancelButton());
        }
    
        public onEnter() {
    
        }
    
        public onLeave() {
    
        }
    }
}