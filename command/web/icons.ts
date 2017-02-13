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
		let version = args.length >= 2 ? args[args.length - 1] : null;

		let icon: string;

		switch (type) {
		case "windows":
		case "linux":
			icon = "os_" + type;
			break;
		case "mac": // Mac OS X
		case "macos":
			icon = "os_mac";
			break;
		case "debian":
		case "ubuntu":
		case "opensuse":
		case "mint":
		case "gentoo":
		case "fedora":
		case "centos":
		case "arch":
		case "kali":
			icon = "dist_" + type;
			break;
		default:
			icon = "unknown";
			break;
		}

		return "static/images/os/" + icon + ".png";
	}

	export function getFileIcon(name: string, isDir?: boolean) {
		if (isDir) {
			return "directory";
		}

		if (name.indexOf(".") !== -1) {
			let ext = name.substring(name.lastIndexOf("."), name.length).toLowerCase();
			let type: string;

			switch (ext) {
				case ".zip":
				case ".tar":
				case ".gz":
					type = "archive";
					break;
				case ".js":
				case ".sh":
				case ".bash":
					type = "script";
					break;
				case ".bat":
				case ".cmd":
				case ".exe":
				case ".jar":
					type = "application";
					break;
				case ".png":
				case ".jpg":
				case ".jpeg":
				case ".gif":
					type = "image";
					break;
				default:
					type = "file";
					break;
			}

			return type;
		}

		return "file";
	}

	export function updatePing() {
		$(".ping").each(function(index, element) {
			let ping = $(this).text();

			$(this).removeClass();
			$(this).addClass("ping");
			$(this).addClass(Icons.getPingClass(ping));

			$(this).text(ping);
		});
	}

	export function updateOSIcons() {
		$(".os").each(function(index, element) {
			let os = $(this).text();
			os = os.trim();

			let icon = Icons.getOperatingSystemIcon(os);

			$(this).children().attr("src", icon);
		});
	}
}
