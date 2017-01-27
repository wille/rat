namespace Icons {

	// Returns ping element class from milliseconds
	export function getPingClass(ms: number): string {
		let clazz;

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

	export function getOperatingSystemIcon(os: string): string {
		let args = os.split(" ");

		// windows, macos, linux...
		let type = args[0].toLowerCase();

		// (Windows) 10, (macOS) 10.12
		let version = args.length >= 2 ? args[1] : null;

		let icon: string;

		switch (type) {
		case "windows":
		case "mac": // Mac OS X
		case "macos":
		case "linux":
			icon = "os_" + type;
			break;
		case "debian":
		case "ubuntu":
		case "opensuse":
			icon = "dist_" + type;
			break;
		default:
			icon = "unknown";
			break;
		}

		return "static/images/os/" + icon + ".png";
	}
}
