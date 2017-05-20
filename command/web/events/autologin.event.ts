class AutoLoginEvent implements Control.IncomingEvent {

	public emit(data) {
		data = JSON.parse(data);
		let authenticated = data.result;

		Control.removeEvent(Control.EventType.LOGIN);

		if (authenticated) {
			console.log("logged in successfully");
		} else {
			console.log("failed to login");
			settings.clearPassword();
			setLoginView();
		}
	}
}
