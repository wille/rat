/// <reference path="../views/login.view.ts" />

class LoginEvent implements Control.IncomingEvent {

	constructor(private view: LoginView) {

	}

	public emit(data) {
		data = JSON.parse(data);

		let authenticated = data.result;

		Control.instance.authenticated = authenticated;

		console.log("Authenticated", authenticated);

		settings.password = this.view.password;

		this.view.setSuccessful(authenticated);

		if (authenticated) {
			this.view.close();
		} else {
			settings.clearPassword();
		}
	}
}
