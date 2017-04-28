/// <reference path="view.ts" />

class LoginView extends MainView {

	private passwordElement: HTMLInputElement;
	private submitElement: HTMLButtonElement;
	private statusElement: HTMLParagraphElement;

	constructor() {
		super("static/login.html", "Login");
	}

	onEnter() {
		this.passwordElement = <HTMLInputElement>document.getElementById("password");
		this.submitElement = <HTMLButtonElement>document.getElementById("login");
		this.statusElement = <HTMLParagraphElement>document.getElementById("login_status");

		this.submitElement.onclick = () => this.login();

		Control.addEvent(Control.EventType.LOGIN, new LoginEvent(this));
	}

	onLeave() {
		Control.removeEvent(Control.EventType.LOGIN);
	}

	public setSuccessful(result: boolean) {
		if (result) {
			this.statusElement.className = "";
			this.statusElement.innerHTML = "Login successful";
		} else {
			this.statusElement.className = "";
			this.statusElement.innerHTML = "Login failed";
		}
	}

	public get password() {
		return this.passwordElement.value;
	}

	private login() {
		console.log("logging in...");
		let password = this.passwordElement.value;

		console.log(this.passwordElement.value);

		Control.init(password);
	}
}
