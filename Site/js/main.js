//main.js

var play = 0;
var setVol = -1;
var cams = [];

var time = "";
var mic = [];

var filename = "";
var recorder = 0;

var flogin = false;
var fuser = "";
var userPic = "";

var dur = 0;
var seek = 0;
var xPos = 0;
var width = 405;
var scrubberOffset = $('#scrubber a').offset();
var scrubbing = false;


// FirebaseSimpleLogin 
var commentsRef = new Firebase("https://decode.firebaseIO.com");
var auth = new FirebaseSimpleLogin(commentsRef, function(error, user) {
	if (error) {
	// an error occurred while attempting login
	alert(error);
	} else if (user) {
	// user authenticated with Firebase
	alert('User ID: ' + user.id + ', Provider: ' + user.provider);

	$('.top-bar-section div p').replaceWith('<a class="right" href="javascript:logout();">Logout</a>');

	fuser = user;
	console.log(fuser);
	// Log out so we can log in again with a different provider.
	auth.logout();
	} else {
	// user is logged out
	}
});

// login to firebase
function login(provider) {
  	console.log('running');
  	flogin = true;
	auth.login(provider);
} 

// logout of firebase
function logout(){
	console.log('running logout fn');
	flogin = false;
	auth.logout();
}

var picture = "";
// comments btn
$('#addit').submit(function(e){
	e.preventDefault();
	console.log('submitted');

	//get the values from the page
	var $form = $(this),
		text = $form.find("textarea").val(),
		url = $form.attr("action");
		
	if(fuser.provider === "google"){
		picture = fuser.picture;
		name = fuser.displayName;
	}

	if(fuser.provider === "github"){
		picture = fuser.avatar_url;
		name = fuser.login;
	}

	// And then we write data to firebase:
	commentsRef.push({name: name, text:text, picture:picture});
	$('#msgarea').val('');
});


commentsRef.on('child_added', function(snapshot) {
  	var message = snapshot.val();
  	console.log(message);
	displayChatMessage(message.name, message.text, message.picture);
});

function displayChatMessage(name, text, picture) {
	console.log("display " + text);

	$('<div/>').text(text).prepend($('<em/>').text(name+': ')).prepend($("<img/>").attr('src', picture)).appendTo($('.userCom'));
	$('.userCom').append('<div class="clearfix"></div>');
	$('.userCom')[0].scrollTop = $('.userCom')[0].scrollHeight;
};

// set up flash
var flashReady = function(){

	// stop btn
	$('#stop').on('click',function(e){
		e.preventDefault();
		console.log('stop_clicked');
		flash.stopPlaying();
	});

	// play and connect to server
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

	// pause control
	$('#leftControls').on('click', '#pause',function(e){
		e.preventDefault();
		console.log('pause_clicked');
		play = 2;

		flash.playPause();
		$('#pause').replaceWith('<a id="play" href="#"><img src="img/play.svg"></a>');
	});
	
	// set up volume control
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

	// getting cameras
	$('#camera').on('click',function(e){
		console.log('camera_clicked');
		e.preventDefault();

		cameras = flash.getCameras();

		cams = cameras;
	});

	// getting mics
	$('#mic').on('click',function(e){
		e.preventDefault();
		console.log('mic_clicked');
		microphones = flash.getMicrophones();
		console.log(microphones);

		mic = microphones[0];
	});

	// start recording
	$('#rightControls').on('click', '#record',function(e){
		e.preventDefault();
		console.log('record_clicked');

		play = 0;
		
		console.log(mic + cams);
		flash.connect('rtmp:/SMSServer');
		$('#record').replaceWith('<a id="recording" href="#"><img src="img/recording.svg"></a>');

	});

	// recording controls stop recording
	$('#rightControls').on('click','#recording',function(e){
		e.preventDefault();
		console.log('recording_clicked');
		
		console.log(mic + cams);
		flash.stopRecording();
		$('#recording').replaceWith('<a id="record" href="#"><img src="img/record.svg"></a>');

	});
};

// connected to the red5 server
var connected = function(success,error){
	if(success == true){
			
		console.log('success Im running');
		
		if(play == 1){
			flash.startPlaying('startrekintodarkness_vp6.flv');
			getDuration();
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

// getting the duration of the movie
var getDuration = function(duration){
	dur = duration;
}

var seekTime = function(time){
	//scrubber equation goes here....

	seek = time;

    if(play === 1){
        moving();
    };
}

$('#scrubber a').mousedown(function(e){
    scrubbing = true;
    $('#scrubber').mousemove(function(e){
        if(e.pageX <= (scrubberOffset.left + width - 10)){
            $('#scrubber a').offset({left: e.pageX});
        }
    });
    e.preventDefault();
});

$('#scrubber a').mouseup(function(e){

    var currentX = $('#scrubber a').position();
    var time = (currentX.left / width) * dur;

    flash.setTime(time);

    $('#scrubber').off('mousemove');
    scrubbing = false;

});

var moving = function(){

    if(scrubbing === false){
        xPos = (seek / dur) * width;
        $('#scrubber a').offset({left: xPos + scrubberOffset.left});
    }

};

var recordingError = function(message,code){
	console.log('somethings up with recording ' + message);
	console.log('code for recording error ' + code)
}

var globalError = function(message){
	console.log('what went wrong??? ' + message);
};