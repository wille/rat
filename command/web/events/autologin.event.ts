interface AutoLoginParameters {
	result: boolean;
}

class AutoLoginEvent implements IncomingEvent<AutoLoginParameters> {

	public emit(data: AutoLoginParameters) {
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
