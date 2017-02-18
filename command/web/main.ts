function exit() {
	Control.instance.write(Control.EventType.EXIT, "");
	window.close();
}
