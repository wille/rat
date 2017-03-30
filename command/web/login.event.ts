/// <reference path="view.ts" />

class LoginEvent implements Control.IncomingEvent {

	constructor(private view: LoginView) { }

	public emit(data) {
		data = JSON.parse(data);

		let authenticated = data.result;

		Control.instance.authenticated = authenticated;

		console.log("Authenticated", authenticated);

		document.cookie = "password=" + this.view.password;

		this.view.setSuccessful(authenticated);

		if (authenticated) {
			setMainView();
		} else {
			clearLoginCookie();
		}
	}
}

class AutoLoginEvent implements Control.IncomingEvent {

	constructor() {

	}

	public emit(data) {
		data = JSON.parse(data);
		let authenticated = data.result;

		Control.removeEvent(Control.EventType.LOGIN);

		if (authenticated) {
			console.log("logged in successfully");
		} else {
			console.log("failed to login");
			clearLoginCookie();
			setLoginView();
		}
	}
}