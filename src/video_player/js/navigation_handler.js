function addKeyHandler(videoPlayer) {
	document.addEventListener('keydown', function (event) {
		showControls();
		switch (event.keyCode) {
			case 10009: //key RETURN
				exitPlayer();
				break;
			case 13: //key ENTER
				if(videoPlayer.paused){
					videoPlayer.play();
				    setPlayButton(false);
					break;
				}
				videoPlayer.pause();
				setPlayButton(true);
				break;
			case 39: // RIGHT 
				if (!videoPlayer.seeking){
					videoPlayer.currentTime = Math.min(videoPlayer.currentTime + rewindSeconds, videoPlayer.seekable.end(0));
				}
				break;
			case 37: // LEFT
				if (!videoPlayer.seeking){
					videoPlayer.currentTime = Math.max(videoPlayer.currentTime - rewindSeconds, videoPlayer.seekable.start(0));
				}
				break;
			case 40: //key DOWN
				hideControls();
				break;
		}
	});
}