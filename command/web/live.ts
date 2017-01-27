// Update selected part of document using jQuery

function update(element: string, url: string, interval: number, callback?: any) {
	return setInterval(function() {
		$(element).load(url, (response, status) => {
			Connection.setConnectionStatus(status !== "error");
			callback();
		});
	}, interval);
}