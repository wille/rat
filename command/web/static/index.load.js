// Invoked after lib.js has loaded

console.log("cookies:", document.cookie);

if (document.cookie.startsWith("password=")) {
	autoLogin();
} else {
	setLoginView();
}

console.log("lib.js: loaded");