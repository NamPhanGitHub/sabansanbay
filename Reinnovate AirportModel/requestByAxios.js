var axios = require('axios');
var URL = "http://10.234.67.244:5000";
 

axios.get(URL+"/control/1")
	.then(function(response){
		console.log("Make a get request successfully ");
		console.log(response.data);

	});