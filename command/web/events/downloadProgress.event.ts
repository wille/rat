interface DownloadProgressParameters {
	file: string;
	read, total: number;
	key: string;
}

class DownloadProgressEvent implements IncomingEvent<DownloadProgressParameters> {

	public emit(data: DownloadProgressParameters) {
		for (let t of Transfers.TRANSFERS) {
			if (t.remote === data.file) {
				t.progress = (data.read / data.total) * 100;

				if (data.read === data.total) {
					t.setStatus(Transfers.Status.COMPLETE, false);
				}

				if (data.key !== undefined) {
					t.key = data.key;
					document.location.href = "/download?key=" + data.key;
				}

				//Transfers.update();

				break;
			}
		}
	}
}