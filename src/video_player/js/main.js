window.onload = function () {
	const urlParams = new URLSearchParams(window.location.search);
	const filePath = urlParams.get(pathParameter);
	const videoWrapper = document.getElementById('video_wrapper');
	const videoPlayer = document.createElement("video");
	videoPlayer.src = URL + filePath;
	videoPlayer.setAttribute("autoplay", "");
	videoWrapper.appendChild(videoPlayer);
	addKeyHandler(videoPlayer);
	initProgressVisuals(videoPlayer);
	videoPlayer.addEventListener('play', () => {
        showControls();
        hideLoading();
    });
}

function exitPlayer(){
	window.history.back();
}