//main.js
//
var play = "";

var flashReady = function(){
	$('#stop').on('click',function(){
		console.log('stop_clicked');
		flash.playPause();
	});

	$('#play').on('click',function(){
		console.log('play_clicked');
		flash.connect('rtmp:/SMSServer');
		play = true;
	});

	$('#volume').on('click',function(){
		console.log('volume_clicked');
	});

	$('#camera').on('click',function(){
		console.log('camera_clicked');

		cams = [];

		flash.getCameras();

		cams = cameras;

		console.log(cams);
	});

	$('#record').on('click',function(){
		console.log('record_clicked');

		flash.startRecording()
	});
};

var connected = function(success,error){
	if(success == true){
			
		console.log('success Im running');
		
		if(play = true){
			flash.startPlaying('startrekintodarkness_vp6.flv');
			
		}
	}

	if(success == false){
		console.log('Ive failed.');
		console.log(error);
	}
};

var recordingError = function(message,code){
	console.log('somethings up with recording ' + message);
	console.log('code for recording error ' + code)
}

var globalError = function(message){
	console.log('what went wrong???' + message);
};