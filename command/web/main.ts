/// <reference path="events/login.event.ts" />
/// <reference path="events/autologin.event.ts" />

/// <reference path="containers/mainview.container.ts" />
/// <reference path="containers/subview.container.ts" />

function autoLogin() {
	Control.addEvent(Control.MessageType.LOGIN, new AutoLoginEvent());

	Control.init(settings.password);
	console.log("auto logging in with", "'" + settings.password + "'");
}

function logout() {
	settings.clearPassword();
	setLoginView();
}