var express = require('express');
var app = express();
var path = require('path');
var socket = require('socket.io');
var axios = require('axios');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var URL1 = "http://192.168.0.116:5000";
var URL2 = "http://192.168.0.117:5000";
var plane1_Finished = false;
var plane2_Finished = false;
var isStarted = false;
var reset;

// body parser middleware 
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// middleware to 
app.use(rawBody);


// set static folder 
app.use(express.static(path.join(__dirname,'public')));
app.set('views',path.join(__dirname,"public/member"));
app.engine('hbs',exphbs({extname: 'hbs', 
						defaultLayout: 'mainLayout', 
						layoutsDir: __dirname + '/public/layouts',
						partialsDir: __dirname + '/public/partial'}));
app.set('view engine','hbs');

//Route http request
app.use("/",require("./route/api/routeForControl"));

const port =  process.env.PORT || 3000;
var server= app.listen(port,() => {
	console.log('Server started on port ' + port);
});

var io=socket(server);

io.on('connection',onConnect);

app.post('/api/control/plane1_Finished',function(req,res){
	res.send("OKKKKK");
	console.log("Plane 1 Finished");
	plane1_Finished=true;
	//io.sockets.emit("Finished");
	if(!reset){
		reset = initTiming();
	}
	IsEverythingFinished();
});

app.post('/api/control/plane2_Finished',function(req,res){
	res.send("OKKKKKK");
	console.log("Plane 2 Finished");
	plane2_Finished=true;
	//io.sockets.emit("Finished");	
	if(!reset){
		reset = initTiming();
	}
	IsEverythingFinished();
});



function onConnect(socket){
	console.log("There is a connection ");
	handleRequestButton("1",socket);
	handleRequestButton("2",socket);
	handleRequestButton("3",socket);
	handleRequestButton("4",socket);
	// testHandleRequestButton("1",socket);
	// testHandleRequestButton("2",socket);
	// testHandleRequestButton("3",socket);
	// testHandleRequestButton("4",socket);
	
}

var refresh = function(){
	return null;
}

function IsEverythingFinished(){
	if(isStarted){
		if(plane2_Finished && plane1_Finished){
 			clearTimeout(reset);
 			reset = refresh();
			resetState();
			io.sockets.emit("Finished");
		}
	}else{
		return;
	}
	
}

function resetState(){
	console.log("KET THUC KICH BAN");
	plane2_Finished=false;
	plane1_Finished=false;
	isStarted=false;
}

function handleRequestButton(index,socket,cb){
	socket.on("Scenario-"+index+"-Start",function(data){
		console.log("Request to implement start on Button " + data.id);
		axios.get(URL1+"/getStartPermission",{
			timeout: 3000
		})
		.then(function(response){
			console.log(response.data);
			axios.get(URL2+"/getStartPermission",{
				timeout: 3000
			})
			.then(function(response){
				isStarted = true;
				console.log(response.data);
				axios.get(URL1+"/control/"+index);
				axios.get(URL2+"/control/"+index);		
				io.sockets.emit("OnRun",data);
			}, error =>{
				reactFailedResponse(error,"plane 1");
			});
		},error =>{
			reactFailedResponse(error,"plane 2");			
		});

	});
}

function testHandleRequestButton(index,socket,cb){
	socket.on("Scenario-"+index+"-Start",function(data){
		console.log("Request to implement start on Button " + data.id);
		axios.get(URL2+"/getStartPermission",{
			timeout: 3000
		})
		.then(function(response){	
			isStarted = true;
			console.log(response.data);
			axios.get(URL2+"/control/"+index);		
			io.sockets.emit("OnRun",data);		
		},error =>{
			reactFailedResponse(error,"plane 2");			
		});

	});
}

function reactFailedResponse(error,planeName){
	if(error.request){
		io.sockets.emit("ErrorConnection",planeName);
		console.log("Cant receive a response from " + planeName);
		// setTimeout(function() {
		// 	axios.get("http://localhost:8080/control");
		// }, 2000);
		
	}
}

function rawBody(req, res, next) {
	req.setEncoding('utf8');
	req.rawBody = '';
	req.on('data', function(chunk) {
		req.rawBody += chunk;
		});
		req.on('end', function(){
		next();
	});
}

function initTiming(){
	return setTimeout(function(cd1, cd2){
					console.log("In setTimeout");
					if(cd1 && cd2){
						resetState();
						io.sockets.emit("Finished");						
					}else{
						console.log("RESET");
						resetState();
						io.sockets.emit("Reset");	
					}
					
				}, 10000, plane2_Finished,plane1_Finished);

}
