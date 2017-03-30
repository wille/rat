class Password {
	
	public static set(password: string) {
		document.cookie = "password=" + password;
	}

	public static get(): string {
		let index = document.cookie.indexOf("password=") + "password=".length;
		let lastIndex = document.cookie.indexOf(";", index);
		let key = document.cookie.substring(index, lastIndex == -1 ? document.cookie.length : lastIndex);

		return key;
	}

	public static clear() {
		document.cookie = "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
	}
}