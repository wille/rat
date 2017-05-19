/// <reference path="view.ts" />

class LoginEvent implements Control.IncomingEvent {

	constructor(private view: LoginView) { }

	public emit(data) {
		data = JSON.parse(data);

		let authenticated = data.result;

		Control.instance.authenticated = authenticated;

		console.log("Authenticated", authenticated);

		Password.set(this.view.password);

		this.view.setSuccessful(authenticated);

		if (authenticated) {
			setMainView(new IndexView());
		} else {
			Password.clear();
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
			Password.clear();
			setLoginView();
		}
	}
}