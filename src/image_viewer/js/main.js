var currentImagePath;

window.onload = function () {
	currentImagePath = "";
	const urlParams = new URLSearchParams(window.location.search);
	currentImagePath = urlParams.get(pathParameter);
	addKeyHandler();
	loadImageByPath(currentImagePath);
}

function displayImageByPathAndRotation(path, rotation){
	const imageViewer = getRotatedImageViewer(rotation);
	const imageWrapper = document.getElementById("image_wrapper");
	imageWrapper.classList.add("hide-image");
	showLoading();
	while (imageWrapper.firstChild) {
		imageWrapper.removeChild(imageWrapper.firstChild);
	}
	imageViewer.onload = function() {
		const ratio = imageViewer.height / imageViewer.width;
		adjustWrapperHeight(imageWrapper, rotation, ratio);
		imageWrapper.appendChild(imageViewer);
		hideLoading();
		imageWrapper.classList.remove("hide-image");
		setCurrentPath(path);
	};
	imageViewer.src = URL + path;
}

function displayRelativeImage(relativeIndex){
	const path = sessionStorage.getItem(sessionPath);
	if(path === null){
		return; 
	}
	loadRelativeImageFromArray(path, relativeIndex);
}

function setCurrentPath(path){
	currentImagePath = path;
	sessionStorage.setItem(sessionFileFocus, path);
}

function exitViewer(){
	window.history.back();
}
