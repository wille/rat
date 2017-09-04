/// <reference path="events/login.event.ts" />
/// <reference path="events/autologin.event.ts" />

/// <reference path="containers/containers.ts" />
/// <reference path="containers/mainview.container.ts" />
/// <reference path="containers/subview.container.ts" />

/// <reference path="views/login.view.ts" />

/// <reference path="settings.ts" />

function autoLogin() {
	Control.addEvent(Control.MessageType.LOGIN, new AutoLoginEvent());

	Control.init(settings.password);
	console.log("auto logging in with", "'" + settings.password + "'");
}

function logout() {
	settings.clearPassword();
	setLoginView();
}

if (document.cookie.indexOf("password=") !== -1) {
	autoLogin();
} else {
	setLoginView();
}