const rewindSeconds = 10;
const controlsDurationMillis = 3000;
var timer;


function initProgressVisuals(videoPlayer){
	videoPlayer.addEventListener("timeupdate", function () {
	      const currentTime = videoPlayer.currentTime;
	      const duration = videoPlayer.duration;
	      const progressPercentage = (currentTime / duration) * 100;
	      const bar = document.getElementById('bar');
	      const currentTimer = document.getElementById("current_time");
	      const remainingTimer = document.getElementById("remaining_time");
	      currentTimer.innerHTML = getTimeFormatted(currentTime);
	      remainingTimer.innerHTML = getTimeFormatted(duration - currentTime);
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
	const playButton = document.getElementById('play');
	playButton.innerHTML = (isPlay ? '<img src="../../icons/play.png"></img>' : '<img src="../../icons/pause.png"></img>');
}

function showControls() {
	const controls = document.getElementById("controls");
	controls.style.opacity = 1;
	clearTimeout(timer);
	timer = setTimeout(hideControls, controlsDurationMillis);
}

function hideControls() {
	const controls = document.getElementById("controls");
	controls.style.opacity = 0;
}