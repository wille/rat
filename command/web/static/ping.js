// Returns ping element class from milliseconds
function getIconClass(ms) {
	var clazz;

	if (ms < 100) {
		clazz = 0;
	} else if (ms < 150) {
		clazz = 1;
	} else if (ms < 250) {
		clazz = 2;
	} else if (ms < 350) {
		clazz = 3;
	} else if (ms < 500) {
		clazz = 4;
	} else {
		clazz = 5;
	}

	return "ping-" + clazz;
}

// Update each .ping with class to display correct icon
function updatePing() {
	$(".ping").each(function(index, element) {
		var ping = $(this).text();
		$(this).removeClass();
		$(this).addClass("ping");
		$(this).addClass(getIconClass(ping));

		$(this).text(ping);
	});
}