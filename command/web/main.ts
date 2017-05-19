/// <reference path="login.event.ts" />

function autoLogin() {
	Control.addEvent(Control.EventType.LOGIN, new AutoLoginEvent());

	let key = Password.get();
	Control.init(key);
	console.log("auto logging in with", "'" + key + "'");
}

function logout() {
	Password.clear();
	setLoginView();
}