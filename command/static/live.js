// Update selected part of document using jQuery

function update(element, url, interval, callback) {
	return setInterval(function() {
		$(element).load(url, callback);
	}, interval);
}