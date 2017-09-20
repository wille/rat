namespace KeyCode {
    
    export const F2 = 113;
    export const F5 = 116;
    export const BACKSPACE = 8;
    export const DELETE = 46;
}

class Hotkey {

    private readonly lambdaListener = (event: KeyboardEvent) => this.listener(event);

    /**
     * @param keyCode keyCode to trigger callback
     * @param callback method called when keyCode is pressed
     * @param override (optional) if we should override normal behaviour
     */
    constructor(private keyCode: number, private callback: () => void, private override = true) {

    }

    /**
     * Listen for keydown event
     */
    public register() {
        document.addEventListener("keydown", this.lambdaListener);
    }

    /**
     * Remove keydown event listener
     */
    public teardown() {
        document.removeEventListener("keydown", this.lambdaListener);
    }

    /**
     * Internal listener which only triggers on correct keycode
     */
    private listener(event: KeyboardEvent) {
        let key = event.which || event.keyCode;

        console.log("hotkey", key);

        if (key === this.keyCode) {
            if (this.override) {
                event.preventDefault();
            }

            this.callback();
        }
    }
}
