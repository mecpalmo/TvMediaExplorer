var url = "http://192.168.0.50";
var script = "/filetree.php?path=";
var currentFilePath = "";
var imageViewer;
var current_tree;

document.addEventListener('DOMContentLoaded', function() {
	
	var urlParams = new URLSearchParams(window.location.search);
	currentFilePath = urlParams.get('param');

	var imageWrapper = document.getElementById('image_wrapper');
	imageViewer = document.createElement("img");
	imageViewer.src = url + currentFilePath;
	imageViewer.onload = function() {
		imageViewer.classList.remove("hide-image");
		hideLoading();
	};
	imageWrapper.appendChild(imageViewer);
	hideLoading();
	
});

document.addEventListener("keydown", function(event) {
	switch (event.keyCode) {
		case 37: //Arrow Left
			getNextImage(-1);
			break;
		case 39: //Arrow Right
			getNextImage(1);
			break;
		case 10009: //Back
			imageViewer.classList.add("hide-image");
			window.history.back();
			break;
	}
});

function getNextImage(i){
	var sessionPath = sessionStorage.getItem('current_path');
	if(sessionPath !== null){ 
		currentFolder = sessionPath;
	}
	getImageArray(currentFolder);
	const current_index = current_tree.findIndex(obj => obj.path === currentFilePath);
	if(current_index != -1){
		const newIndex = current_index + i;
		if(newIndex >= 0 && newIndex < current_tree.length){
			updateImageViewer(current_tree[newIndex].path)
			updateSessionFile(current_tree[newIndex].name);
		}
	}
}

function updateImageViewer(path){
	showLoading();
	imageViewer.classList.add("hide-image");
	imageViewer.src = url + path;
	currentFilePath = path;
}

function updateSessionFile(fileName){
	sessionStorage.setItem('last_file_focused', fileName);
}

function getImageArray(path){
	fetch(url + script + path)
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		current_tree = data.filter(obj => obj.mediaType === "image");
	})
	.catch(function(error) {
		current_tree = [];
		console.error(error);
	});
}

function showLoading(){
	const loader = document.getElementById("loader");
	loader.style.display = "block";
}

function hideLoading(){
	const loader = document.getElementById("loader");
	loader.style.display = "none";
}