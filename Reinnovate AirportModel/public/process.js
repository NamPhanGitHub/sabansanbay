var socket = io.connect('http://localhost:3000');
socket.Pressed = false;

$(document).ready(function(){	
	$(".layOut").each(function(index){
		$(this).addClass("btn-primary");
		$(this).click(handleButtonClick);
	});
	socket.on("Finished",function(){
		$(".layOut").each(function(index){
			$(this).removeClass("btn-success btn-danger").addClass("btn-primary");
			$(this).html("START");
			$(this).click(handleButtonClick);
		});
	});
	socket.on("OnRun",function(data){
		var btPressed = "button"+data.id;
		$(".layOut").each(function(index){
			$(this).off("click");
			if($(this).attr("id")===btPressed){
				$(this).removeClass("btn-primary").addClass("btn-success");
				$(this).html('Running');
			}else{
				$(this).removeClass("btn-primary").addClass("btn-danger");
				$(this).html('Disable');
			}
		});
	})
	socket.on("ErrorConnection",function(data){
		$(".layOut").each(function(index){
			$(this).removeClass("btn-success btn-danger").addClass("btn-primary");
			$(this).html("START");
		});
	});
	socket.on("Reset",function(data){
		alert("Disconnected!! Reset everything");
		$(".layOut").each(function(index){
			$(this).removeClass("btn-success btn-danger").addClass("btn-primary");
			$(this).html("START");
			$(this).click(handleButtonClick);
		});
	});

});


function handleButtonClick(){
	var selectedBt = $(this).attr("title");
	$(".layOut").each(function(index){
		if($(this).attr("title") === selectedBt){
			$(this).removeClass("btn-primary").addClass("btn-success");
			$(this).html('Running');
			socket.emit("Scenario-"+String(index+1)+"-Start",{
				id:String(index+1)
			});	
		}
	});
}

