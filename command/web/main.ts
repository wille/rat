function autoLogin() {
	Control.addEvent(Control.EventType.LOGIN, new AutoLoginEvent());

	let key = Password.get();
	Control.init(key);
	console.log("auto logging in with", "'" + key + "'");
	setMainView();
}

function logout() {
	Control.instance.write(Control.EventType.EXIT, "");
	Password.clear();
	setLoginView();
}
