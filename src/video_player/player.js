var url = "http://192.168.0.50";
var currentFilePath = "";
var current_tree;
var timerId;

window.onload = function () {
	var urlParams = new URLSearchParams(window.location.search);
	var filePath = urlParams.get('param');
	var videoWrapper = document.getElementById('video_wrapper');
	var videoPlayer = document.createElement("video");
	videoPlayer.src = filePath;
	videoPlayer.setAttribute("autoplay", "");
	videoWrapper.appendChild(videoPlayer);
	registerKeyHandler(videoPlayer);
	initProgressVisuals(videoPlayer);
	videoPlayer.addEventListener('play', () => {
        showControls();
        hideLoading();
    });
}

function initProgressVisuals(videoPlayer){
	videoPlayer.addEventListener("timeupdate", function () {
	      const currentTime = videoPlayer.currentTime;
	      const duration = videoPlayer.duration;
	      const progressPercentage = (currentTime / duration) * 100;
	      var bar = document.getElementById('bar');
	      var current_timer = document.getElementById("current_time");
	      var remaining_timer = document.getElementById("remaining_time");
	      current_timer.innerHTML = getTimeFormatted(currentTime);
	      remaining_timer.innerHTML = getTimeFormatted(duration - currentTime);
	      bar.style.width = progressPercentage + "%";
	});
}

function getTimeFormatted(time){
	const hours = Math.floor(time / 3600);
	const minutes = Math.floor((time % 3600) / 60);
	const seconds = Math.floor(time % 60);
	if (hours > 0) {
		const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	    return formattedTime;
	} else {
		const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
		return formattedTime;
	}
}

function setPlayButton(isPlay){
	var playButton = document.getElementById('play');
	if(isPlay){
		playButton.innerHTML = '<img src="../../icons/play.png"></img>';
	}else{
		playButton.innerHTML = '<img src="../../icons/pause.png"></img>';
	}
}

function registerKeyHandler(videoPlayer) {
	document.addEventListener('keydown', function (event) {
		var seekJump = 10;
		showControls();
		switch (event.keyCode) {
			case 10009: //key RETURN
				window.history.back();
				break;
			case 13:  //key ENTER
				if (videoPlayer.paused) {
				    videoPlayer.play();
				    setPlayButton(false);
				  } else {
				    videoPlayer.pause();
				    setPlayButton(true);
				  }
				break;
			case 415: //key PLAY
				videoPlayer.play();
				break;
			case 413: //key STOP
				videoPlayer.stop();
				break;
			case 19: //key PAUSE
				videoPlayer.pause();
				break;
			case 39: // RIGHT
			case 417: //key FF 
				if (!videoPlayer.seeking){
					if(videoPlayer.currentTime + seekJump < videoPlayer.seekable.end(0)){
						videoPlayer.currentTime += seekJump;
					}
				}
				break;
			case 37: // LEFT
			case 412: //key REWIND
				if (!videoPlayer.seeking){
					if(videoPlayer.currentTime - seekJump > videoPlayer.seekable.start(0)){
						videoPlayer.currentTime -= seekJump;
					}else{
						videoPlayer.currentTime = 0;
					}
				}
				break;
			case 40: //key DOWN
				hideControls();
				break;
		}
	});
}

function showControls() {
	const controls = document.getElementById("controls");
	controls.style.opacity = 1;
	clearTimeout(timerId);
	timerId = setTimeout(hideControls, 3000);
}

function hideControls() {
	const controls = document.getElementById("controls");
	controls.style.opacity = 0;
}

function showLoading(){
	const loader = document.getElementById("loader");
	loader.style.display = "block";
}

function hideLoading(){
	const loader = document.getElementById("loader");
	loader.style.display = "none";
}