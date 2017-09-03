/// <reference path="../views/login.view.ts" />

interface LoginParameters {
	result: boolean;
}

class LoginEvent implements IncomingEvent<LoginParameters> {

	constructor(private view: LoginView) {

	}

	public emit(data: LoginParameters) {
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
