/// <reference path="view.ts" />

class LoginView extends MainView {

	private passwordElement: HTMLInputElement;
	private submitElement: HTMLButtonElement;
	private statusElement: HTMLParagraphElement;

	constructor() {
		super("login.html", "Login");
	}

	public onEnter() {
		this.passwordElement = <HTMLInputElement>document.getElementById("password");
		this.submitElement = <HTMLButtonElement>document.getElementById("login");
		this.statusElement = <HTMLParagraphElement>document.getElementById("login_status");

		this.submitElement.onclick = () => this.login();

		Control.addEvent(Control.MessageType.LOGIN, new LoginEvent(this));

		Statusbar.hide();
	}

	public onLeave() {
		Control.removeEvent(Control.MessageType.LOGIN);
		Statusbar.show();
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

	/**
	 * LoginView is always shown in full screen, no tabs or other elements visible
	 * Restore all elements thats hidden, and set clients view as selected
	 */
	public close() {
		$(mainViewTabs).show();
		$(subViewContainer).show();
		main.closeView(this);
		main.setActiveView(MainViewContainer.clientsView);
	}
}

function setLoginView() {
	main.setView(new LoginView());
	$(mainViewTabs).hide();
	$(subViewContainer).hide();
}