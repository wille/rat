function exit() {
	Control.instance.write(Control.EventType.EXIT, "");
	window.close();
}

function clearLoginCookie() {
	document.cookie = "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
}

function autoLogin() {
	Control.addEvent(Control.EventType.LOGIN, new AutoLoginEvent());

	let index = document.cookie.indexOf("password=") + "password=".length;
	let lastIndex = document.cookie.indexOf(";", index);
	let key = document.cookie.substring(index, lastIndex == -1 ? document.cookie.length : lastIndex);
	Control.init(key);
	console.log("auto logging in with", "'" + key + "'");
	setMainView();
}

function logout() {
	clearLoginCookie();
	setLoginView();
}
