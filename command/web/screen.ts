function connect(id, elem) {
	let ws = new WebSocket("wss://localhost:7777/ssock")

	ws.onmessage = function(event) {
		elem.src = "data:image/jpg;base64," + event.data;
	}

	ws.onopen = function() {
		ws.send(id + "\n")
	}
}