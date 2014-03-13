//main.js

var flashReady = Function(){

	$('#playBtn').on('click',function(){
		flash.connect('rtmp://localhost');
	});

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
}

});