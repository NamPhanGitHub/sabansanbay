function createRequest() {
	try {
		request = new XMLHttpRequest();
	} catch (tryMS) {
		try {
			request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (otherMS) {
			try {
				request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (failed) {
				request = null;
			}
		}
	}
	return request;
}

function showUsernameStatus() {
	if (request.readyState == 4) {
		if (request.status == 200) {
			if (request.responseText == "okay") {
			// if it's okay, no error message to show
			}
			else {
			// if there's a problem, we'll tell the user
			alert("Sorry, that username is taken.");
			}
		}
	}
}