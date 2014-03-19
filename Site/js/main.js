//main.js
//
var play = 0;
var setVol = -1;
var cams = [];

var time = "";
var mic = [];

var filename = "";
var recorder = 0;


var flashReady = function(){
	$('#stop').on('click',function(e){
		e.preventDefault();
		console.log('stop_clicked');
		flash.stopPlaying();
	});

	$('#leftControls').on('click', '#play',function(e){
		e.preventDefault();
		console.log('play_clicked');
		play = 1;
		if(play = 1){
			flash.connect('rtmp:/SMSServer');
		}else if(play = 2){
			flash.playPause();
		}
		
		$('#play').replaceWith('<a id="pause" href="#"><img src="img/pause.svg"></a>');
	});

	$('#leftControls').on('click', '#pause',function(e){
		e.preventDefault();
		console.log('pause_clicked');
		play = 2;

		flash.playPause();
		$('#pause').replaceWith('<a id="play" href="#"><img src="img/play.svg"></a>');
	});
	
	$('#rightControls').on('click','#volume',function(e){
		console.log('volume_clicked');
		var vol = flash.getVolume();
		e.preventDefault();
		// console.log(vol);

		//change the setVol everytime clicked
		setVol += 1;

		//swap volume image depending on volume level
		if(setVol == 0){
			$('#volume img').replaceWith('<img src="img/lowVol.svg">');	
		}
		else if(setVol == 1){
			$('#volume img').replaceWith('<img src="img/twoVol.svg">');	
		}
		else if(setVol == 2){
			$('#volume img').replaceWith('<img src="img/threeVol.svg">');	
		}
		else if(setVol == 3){ 			
			$('#volume img').replaceWith('<img src="img/volume.svg">');	
		}
			
		if(setVol > 3){
			setVol = -1;
		}

		flash.setVolume(setVol);
		console.log('setvol ' + setVol);
	});


	$('#camera').on('click',function(e){
		console.log('camera_clicked');
		e.preventDefault();

		cameras = flash.getCameras();

		cams = cameras;
	});

	$('#mic').on('click',function(e){
		e.preventDefault();
		console.log('mic_clicked');
		microphones = flash.getMicrophones();
		console.log(microphones);

		mic = microphones[0];
	});


	$('#rightControls').on('click', '#record',function(e){
		e.preventDefault();
		console.log('record_clicked');

		play = 0;
		
		console.log(mic + cams);
		flash.connect('rtmp:/SMSServer');
		$('#record').replaceWith('<a id="recording" href="#"><img src="img/recording.svg"></a>');

	});

	$('#rightControls').on('click','#recording',function(e){
		e.preventDefault();
		console.log('recording_clicked');
		
		console.log(mic + cams);
		flash.stopRecording();
		$('#recording').replaceWith('<a id="record" href="#"><img src="img/record.svg"></a>');

	});
};

var connected = function(success,error){
	if(success == true){
			
		console.log('success Im running');
		
		if(play == 1){
			flash.startPlaying('startrekintodarkness_vp6.flv');
		}

		if(play == 0){
			flash.startRecording("recording.flv",cams[0], mic[0]);
		}

	}

	if(success == false){
		console.log('Ive failed.');
		console.log(error);
	}
};

var seekTime = function(time){
	//scrubber equation goes here....
}

var recordingError = function(message,code){
	console.log('somethings up with recording ' + message);
	console.log('code for recording error ' + code)
}

var globalError = function(message){
	console.log('what went wrong??? ' + message);
};