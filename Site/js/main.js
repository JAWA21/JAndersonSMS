//main.js

$(document).ready(function(){
	$('#play').on('click',function(){
		console.log('play_clicked');
		
	});

	$('#stop').on('click',function(){
		console.log('stop_clicked');
	});

	$('#volume').on('click',function(){
		console.log('volume_clicked');
	});

	$('#camera').on('click',function(){
		console.log('camera_clicked');
	});

	$('#record').on('click',function(){
		console.log('record_clicked');
	});

var flashReady = function(){

	$( "#stop" ).mouseover(function() {
  		$(this).css("background-color", "blue");
	});

	mediaPlayer.addEventListener('timeupdate', updateProgressBar, false);
	
};

	function updateProgressBar() {
	   var progressBar = $('#progress-bar');
	   var percentage = Math.floor((100 / mediaPlayer.duration) *
	   	mediaPlayer.currentTime);
	   progressBar.value = percentage;
	   progressBar.innerHTML = percentage + '% played';
	};

});